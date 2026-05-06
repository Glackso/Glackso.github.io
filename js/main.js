// Window Management
function openApp(id) {
    const win = document.getElementById(id);
    win.style.display = 'block';
    if(id === 'my-computer') renderFiles("C:\\");
}

function closeApp(id) {
    document.getElementById(id).style.display = 'none';
}

// File Navigation
function renderFiles(path) {
    const viewer = document.getElementById('file-viewer');
    document.getElementById('current-path').innerText = path;
    viewer.innerHTML = '';

    const items = driveC[path] || [];
    
    items.forEach(item => {
        const li = document.createElement('li');
        // Use your new icon folder
        const icon = item.type === 'folder' ? 'folder.png' : 'notepad.png';
        
        li.innerHTML = `<img src="assets/icons/32/${icon}" width="16"> ${item.name}`;
        li.className = "file-item"; 
        
        li.onclick = () => {
            if (item.type === 'folder') {
                const nextPath = path === "C:\\" ? path + item.name : path + "\\" + item.name;
                currentHistory.push(nextPath);
                renderFiles(nextPath);
            } else {
                openFile(item);
            }
        };
        viewer.appendChild(li);
    });
}

function openFile(file) {
    // If it's a .txt file, open Notepad and inject the content
    if (file.name.endsWith('.txt')) {
        openApp('notepad');
        const notepadTextArea = document.querySelector('#notepad textarea');
        const notepadTitle = document.querySelector('#notepad .title-bar-text');
        
        notepadTextArea.value = file.content;
        notepadTitle.innerText = `${file.name} - Notepad`;
    }
}

// ... include your existing goBack and interact.js code here ...

function goBack() {
    if (currentHistory.length > 1) {
        currentHistory.pop();
        renderFiles(currentHistory[currentHistory.length - 1]);
    }
}

// Interact.js Draggable Logic
interact('.draggable').draggable({
    allowFrom: '.title-bar',
    listeners: {
        move (event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});
