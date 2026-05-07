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
        // FIX: Point to your local assets folder instead of the external URL
        const iconSize = item.type === 'folder' ? '16' : '16'; 
        const iconName = item.type === 'folder' ? 'folder.png' : 'notepad.png';
        const iconPath = `assets/icons/${iconSize}/${iconName}`;
        
        li.innerHTML = `<img src="${iconPath}" width="16" onerror="this.src='https://winxp.vercel.app/icons/${item.type === 'folder' ? 'explorer.png' : 'notepad.png'}'"> ${item.name}`;
        
        li.onclick = () => {
            if (item.type === 'folder') {
                // Fix path joining logic
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
