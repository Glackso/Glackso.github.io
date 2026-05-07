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
       const icon = item.type === 'folder' ? 'folder.png' : 'notepad.png';
        li.innerHTML = `<img src="https://winxp.vercel.app/icons/${icon}" width="16"> ${item.name}`;
        
        li.onclick = () => {
            if (item.type === 'folder') {
                const newPath = path === "C:\\" ? `${path}${item.name}` : `${path}\\${item.name}`;
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
