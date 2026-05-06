// --- STATE TRACKING ---
let currentOpenFile = null; // Remembers what file is currently open in Notepad

// --- WINDOW MANAGEMENT ---
function openApp(id) {
    const win = document.getElementById(id);
    if (!win) return; // Safety check prevents the "null" error!
    
    win.style.display = 'block';
    
    if (id === 'my-computer') {
        renderFiles("C:\\");
    }
}

function closeApp(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
}

// --- NOTEPAD & SAVING LOGIC ---
function openEmptyNotepad() {
    currentOpenFile = null; // Tell the system this is a brand new file
    openApp('notepad');
    
    document.querySelector('#notepad textarea').value = "";
    document.querySelector('#notepad .title-bar-text').innerText = "Untitled - Notepad";
}

function openFile(file) {
    if (file.name.endsWith('.txt')) {
        currentOpenFile = file; // Remember this specific file object
        openApp('notepad');
        
        document.querySelector('#notepad textarea').value = file.content;
        document.querySelector('#notepad .title-bar-text').innerText = `${file.name} - Notepad`;
    }
}

function saveNote() {
    const textAreaContent = document.querySelector('#notepad textarea').value;

    if (currentOpenFile) {
        // OVERWRITE EXISTING FILE
        currentOpenFile.content = textAreaContent;
        alert(`Saved changes to ${currentOpenFile.name}!`);
    } else {
        // CREATE NEW FILE
        let fileName = prompt("Enter file name:", "New Note.txt");
        if (!fileName) return; // If user clicks cancel, do nothing

        // Make sure it has .txt at the end
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt';
        }

        // Create the new file object
        const newFile = {
            name: fileName,
            type: "file",
            content: textAreaContent
        };

        // Push it into the "My Notes" folder
        driveC["C:\\My Notes"].push(newFile);
        
        // Update Notepad UI to reflect the new saved file
        currentOpenFile = newFile; 
        document.querySelector('#notepad .title-bar-text').innerText = `${fileName} - Notepad`;
        
        alert(`Saved to C:\\My Notes!`);

        // If My Computer happens to be open to "My Notes" right now, refresh it so the new file appears instantly!
        const activePath = document.getElementById('current-path').innerText;
        if (activePath === "C:\\My Notes") {
            renderFiles("C:\\My Notes");
        }
    }
}

// --- FILE SYSTEM NAVIGATION ---
function renderFiles(path) {
    const viewer = document.getElementById('file-viewer');
    document.getElementById('current-path').innerText = path;
    viewer.innerHTML = '';

    const items = driveC[path] || [];
    
    if (items.length === 0) {
        viewer.innerHTML = '<li style="padding: 10px; color: gray;">(Folder is empty)</li>';
        return;
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = "file-item"; 
        
        // Use basic emojis if icons are missing, or map your 32x32 images
        const iconSrc = item.type === 'folder' ? '📁' : '📝'; 
        li.innerHTML = `<span style="font-size: 16px;">${iconSrc}</span> <span style="margin-left: 5px;">${item.name}</span>`;
        
        li.style.cursor = "pointer";
        li.style.padding = "5px";
        li.style.display = "flex";
        li.style.alignItems = "center";
        
        // Hover effect via JS since we don't have all your CSS
        li.onmouseenter = () => { li.style.backgroundColor = "#316ac5"; li.style.color = "white"; };
        li.onmouseleave = () => { li.style.backgroundColor = "transparent"; li.style.color = "black"; };

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

function goBack() {
    if (currentHistory.length > 1) {
        currentHistory.pop(); // Remove current folder
        const previousPath = currentHistory[currentHistory.length - 1]; // Get previous
        renderFiles(previousPath);
    }
}

// --- INTERACT.JS DRAGGING ---
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
