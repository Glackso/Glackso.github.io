const driveC = {
    "C:\\": [
        { name: "Windows", type: "folder" },
        { name: "Documents", type: "folder" },
        { name: "My Notes", type: "folder" }
    ],
    "C:\\Windows": [
        { name: "System32", type: "folder" }
    ],
    "C:\\Documents": [
        { name: "Readme.txt", type: "file", content: "Welcome to your new XP Simulator!" }
    ],
    "C:\\My Notes": []
};

let currentHistory = ["C:\\"];

function renderFiles(path) {
    const viewer = document.getElementById('file-viewer');
    const pathDisplay = document.getElementById('current-path');
    if (!viewer) return;

    viewer.innerHTML = "";
    pathDisplay.innerText = path;

    const files = driveC[path] || [];
    files.forEach(item => {
        const li = document.createElement('li');
        li.className = "file-item";
        
        // Logical check for icons
        let iconName = 'documents.png'; // Default for files
        if (item.type === 'folder') {
            iconName = 'folder.png';
        }
        
        const iconPath = `assets/icons/16/${iconName}`;
        
        li.innerHTML = `<img src="${iconPath}" width="16" onerror="this.src='https://winxp.vercel.app/icons/${item.type === 'folder' ? 'explorer.png' : 'notepad.png'}'"> ${item.name}`;
        
        li.onclick = () => {
            if (item.type === 'folder') {
                const newPath = path.endsWith('\\') ? `${path}${item.name}` : `${path}\\${item.name}`;
                currentHistory.push(newPath);
                renderFiles(newPath);
            } else {
                notepadApp.openExisting(item);
            }
        };
        viewer.appendChild(li);
    });
}

function goBack() {
    if (currentHistory.length > 1) {
        currentHistory.pop();
        renderFiles(currentHistory[currentHistory.length - 1]);
    }
}
