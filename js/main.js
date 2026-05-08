let openWindows = {};
let highestZIndex = 20;

// --- Window Z-Index & Taskbar Focus Logic ---
function focusWindow(id) {
    const win = document.getElementById(id);
    if (!win || win.style.display === 'none') return;

    // Bring to front
    highestZIndex++;
    win.style.zIndex = highestZIndex;

    // Remove active class from ALL taskbar buttons
    document.querySelectorAll('.taskbar-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class only to the focused window
    const activeBtn = document.getElementById(`taskbar-btn-${id}`);
    if (activeBtn) activeBtn.classList.add('active');
}

const AppManager = {
    zIndex: 100,
    openWindows: {},

    getAppContent(type, params = {}) {
        const apps = {
            'notepad': {
                title: params.fileName || "Untitled - Notepad",
                icon: "assets/icons/16/notepad.png",
                html: `
                    <div class="menu-bar">
                        <li onclick="toggleMenu('file-menu')">File
                            <ul id="file-menu" class="dropdown">
                                <li onclick="AppManager.apps.notepad.save('${type}')">Save</li>
                                <li class="divider"></li>
                                <li onclick="AppManager.close('${type}')">Exit</li>
                            </ul>
                        </li>
                    </div>
                    <textarea id="notepad-text" spellcheck="false">${params.content || ''}</textarea>`
            },
            'cmd': {
                title: "Command Prompt",
                icon: "assets/icons/16/cmd.png",
                html: `<div class="cmd-body">
                        <div id="cmd-history">Microsoft Windows XP [Version 5.1.2600]\n(C) Copyright 1985-2001 Microsoft Corp.\n\n</div>
                        <div style="display:flex"><span>C:\\></span><input id="cmd-input" spellcheck="false"></div>
                       </div>`
            },
            'computer': {
                title: "My Computer",
                icon: "assets/icons/16/computer.png",
                html: `<div class="nav-bar">
                        <button onclick="goBack()">Back</button>
                        <span id="current-path">C:\\</span>
                       </div>
                       <ul id="file-viewer" class="tree-view"></ul>`
            },
            'internet-explorer': {
                title: "Internet Explorer",
                icon: "assets/icons/16/ie.png",
                html: `<div class="ie-wrapper">
                        <div class="nav-bar">
                            <span>Address</span>
                            <input type="text" id="ie-address" value="https://www.google.com/search?igu=1">
                            <button onclick="AppManager.apps.ie.navigate()">Go</button>
                        </div>
                        <iframe id="ie-frame" src="https://www.google.com/search?igu=1"></iframe>
                       </div>`
            }
        };
        return apps[type] || null;
    },

    open(type, params = {}) {
        // If app is already open, just focus it
        if (this.openWindows[type]) {
            this.focus(type);
            return;
        }

        const data = this.getAppContent(type, params);
        if (!data) return;

        const win = document.createElement('div');
        win.id = type;
        win.className = 'window draggable';
        win.style.left = "100px";
        win.style.top = "100px";

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
                    <img src="${data.icon}" width="14" onerror="this.style.display='none'"> 
                    <span id="${type}-title">${data.title}</span>
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="AppManager.minimize('${type}')"></button>
                    <button aria-label="Maximize" onclick="maximizeApp('${type}')"></button>
                    <button aria-label="Close" onclick="AppManager.close('${type}')"></button>
                </div>
            </div>
            <div class="window-body">${data.html}</div>
        `;

        document.getElementById('desktop').appendChild(win);
        this.openWindows[type] = true;
        
        // --- App Specific Initializers (Fixes the NULL errors) ---
        if (type === 'computer') renderFiles("C:\\");
        if (type === 'cmd') this.initCMD(win);
        if (type === 'notepad' && params.fileRef) win.fileRef = params.fileRef;

        this.createTaskbarBtn(type, data.title, data.icon);
        this.makeDraggable(win);
        this.focus(type);
    },

    close(id) {
        const win = document.getElementById(id);
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (win) win.remove();
        if (btn) btn.remove();
        delete this.openWindows[id];
    },

    focus(id) {
        const win = document.getElementById(id);
        if (win) {
            win.style.display = 'flex';
            win.style.zIndex = ++this.zIndex;
            document.querySelectorAll('.taskbar-btn').forEach(b => b.classList.remove('active'));
            const btn = document.getElementById(`taskbar-btn-${id}`);
            if (btn) btn.classList.add('active');
        }
    },

    minimize(id) {
        const win = document.getElementById(id);
        if (win) win.style.display = 'none';
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (btn) btn.classList.remove('active');
    },

    // App Logic Bundles
    apps: {
        notepad: {
            save: function(id) {
                const win = document.getElementById(id);
                const content = win.querySelector('#notepad-text').value;
                let fileName = "";

                if (win.fileRef) {
                    win.fileRef.content = content;
                    fileName = win.fileRef.name;
                } else {
                    fileName = prompt("Save As:", "New Note.txt");
                    if (!fileName) return;
                    
                    // --- Custom Property Logic: Auto-add .txt ---
                    if (!fileName.toLowerCase().endsWith('.txt')) {
                        fileName += '.txt';
                    }
                    
                    const newFile = { name: fileName, type: "file", content: content };
                    driveC["C:\\My Notes"].push(newFile);
                    win.fileRef = newFile;
                }
                
                document.getElementById(`${id}-title`).innerText = `${fileName} - Notepad`;
                alert(`Saved ${fileName} successfully!`);
            }
        },
        ie: {
            navigate: function() {
                const url = document.getElementById('ie-address').value;
                document.getElementById('ie-frame').src = url;
            }
        }
    },

    initCMD(win) {
        const input = win.querySelector('#cmd-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runCommand(input.value);
        });
        win.addEventListener('mousedown', () => setTimeout(() => input.focus(), 10));
    },

    createTaskbarBtn(id, title, icon) {
        const btn = document.createElement('div');
        btn.id = `taskbar-btn-${id}`;
        btn.className = 'taskbar-btn';
        btn.innerHTML = `<img src="${icon}" width="14"> ${title}`;
        btn.onclick = () => {
            const win = document.getElementById(id);
            if (win.style.display === 'none' || parseInt(win.style.zIndex) < this.zIndex) this.focus(id);
            else this.minimize(id);
        };
        document.getElementById('taskbar-apps').appendChild(btn);
    },

    makeDraggable(el) {
        if (typeof interact === 'undefined') return;
        interact(el).draggable({
            allowFrom: '.title-bar',
            listeners: {
                move: (event) => {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        });
    }
};

// --- Start Menu Logic ---
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// --- File Explorer (Unchanged) ---
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
        const iconSrc = item.type === 'folder' ? '📁' : '📝'; 
        li.innerHTML = `<span style="font-size: 16px;">${iconSrc}</span> <span>${item.name}</span>`;
        
        li.onclick = () => {
            if (item.type === 'folder') {
                const nextPath = path === "C:\\" ? path + item.name : path + "\\" + item.name;
                currentHistory.push(nextPath);
                renderFiles(nextPath);
            } else if (item.name.endsWith('.txt')) {
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

// --- Click Outside Handlers ---
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    // Close Notepad Menus
    if (!event.target.closest('.menu-bar')) {
        document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
    // Close Start Menu if clicking desktop or window (not taskbar)
    if (!event.target.closest('#start-menu') && !event.target.closest('.start-button')) {
        document.getElementById('start-menu').style.display = 'none';
    }
});

// --- Safer Clock (Prevents the 'null' error) ---
setInterval(() => {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}, 1000);

// --- Cool CMD Logic ---
function runCommand(input) {
    const cmdBody = document.querySelector('.cmd-body');
    const command = input.toLowerCase().trim();
    let response = "";

    if (command === "help") {
        response = "Available commands: HELP, CLS, DIR, DATE, ECHO, WINVER";
    } else if (command === "cls") {
        cmdBody.innerHTML = 'Microsoft Windows XP [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br><br>';
        return;
    } else if (command === "winver") {
        response = "Microsoft Windows XP [Version 5.1.2600] - Retro Edition";
    } else if (command === "date") {
        response = "The current date is: " + new Date().toLocaleDateString();
    } else if (command.startsWith("echo ")) {
        response = input.substring(5);
    } else if (command === "dir") {
        response = "Directory of C:\\<br>01/01/2001  12:00 PM    &lt;DIR&gt;          Windows<br>01/01/2001  12:00 PM    &lt;DIR&gt;          Documents and Settings";
    } else {
        response = `'${command}' is not recognized as an internal or external command.`;
    }

    cmdBody.innerHTML += `C:\\Documents and Settings\\Guest&gt; ${input}<br>${response}<br><br>`;
    // Auto-scroll to bottom
    const win = document.getElementById('cmd');
    win.querySelector('.window-body').scrollTop = win.querySelector('.window-body').scrollHeight;
}

// Add an input listener to CMD so it's not just a placeholder
document.addEventListener('keydown', (e) => {
    if (document.getElementById('cmd').style.display === 'block' && document.activeElement.tagName !== 'TEXTAREA') {
        // This is a simplified "typing" experience for the placeholder
        if (e.key === 'Enter') {
            runCommand("help"); // For now, any enter triggers help until we add a real input
        }
    }
});

// --- Interact.js Dragging Engine ---
if (typeof interact !== 'undefined') {
    // 1. Draggable Windows
    interact('.draggable').draggable({
        allowFrom: '.title-bar',
        listeners: {
            start(event) { focusWindow(event.target.id); }, // Bring to front on click/drag
            move(event) {
                const target = event.target;
                if (target.classList.contains('maximized')) return; // Prevent dragging if full screen
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });

    // 2. Draggable Desktop Icons
    interact('.draggable-icon').draggable({
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });
} else {
    console.error("Interact.js failed to load.");
}

// --- Desktop Icon Selection Logic ---
function selectIcon(element, event) {
    event.stopPropagation(); // Stop desktop click from firing
    
    // If user holds CTRL, let them select multiple. Otherwise, clear others.
    if (!event.ctrlKey) {
        document.querySelectorAll('.shortcut').forEach(el => el.classList.remove('selected'));
    }
    element.classList.add('selected');
}

// Clear selections when clicking empty desktop
document.getElementById('desktop').addEventListener('mousedown', (e) => {
    if (!e.target.closest('.shortcut') && !e.target.closest('.window')) {
        document.querySelectorAll('.shortcut').forEach(el => el.classList.remove('selected'));
    }
});

// --- Blue Selection Box Engine ---
let isSelecting = false;
let startX, startY;
let selectionBox = document.createElement('div');
selectionBox.className = 'selection-box';

document.getElementById('desktop').addEventListener('mousedown', (e) => {
    // Only draw box if clicking directly on the desktop (not on an icon or window)
    if (e.target.closest('.shortcut') || e.target.closest('.window') || e.target.closest('.taskbar')) return;
    
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    document.body.appendChild(selectionBox);
});

document.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // Calculate Box Size and flip direction if dragging backwards
    selectionBox.style.width = Math.abs(currentX - startX) + 'px';
    selectionBox.style.height = Math.abs(currentY - startY) + 'px';
    selectionBox.style.left = Math.min(startX, currentX) + 'px';
    selectionBox.style.top = Math.min(startY, currentY) + 'px';
});

document.addEventListener('mouseup', () => {
    if (isSelecting) {
        isSelecting = false;
        if(selectionBox.parentNode) {
            selectionBox.parentNode.removeChild(selectionBox);
        }
        // Future feature: loop through icons here to see if they are inside the box!
    }
});

function renderFiles(path) {
    const viewer = document.getElementById('file-viewer');
    const pathDisplay = document.getElementById('current-path');
    if (pathDisplay) pathDisplay.innerText = path;
    
    viewer.innerHTML = '';
    const items = driveC[path] || [];

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = "file-item";
        const icon = item.type === 'folder' ? '📁' : '📝';
        li.innerHTML = `<span>${icon}</span> <span>${item.name}</span>`;

        li.ondblclick = () => {
            if (item.type === 'folder') {
                const nextPath = path.endsWith('\\') ? path + item.name : path + '\\' + item.name;
                currentHistory.push(nextPath);
                renderFiles(nextPath);
            } else if (item.name.endsWith('.txt')) {
                // Pass custom properties to the modular opener
                AppManager.open('notepad', { 
                    content: item.content, 
                    fileName: item.name,
                    fileRef: item 
                });
            }
        };
        viewer.appendChild(li);
    });
}

document.getElementById('cmd-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const input = this.value;
        const history = document.getElementById('cmd-history');
        const command = input.toLowerCase().trim();
        let response = "";

        if (command === "help") {
            response = "HELP - Displays this message\nCLS - Clears the screen\nDIR - Lists directory\nEXIT - Closes CMD\nWINVER - About Windows";
        } else if (command === "cls") {
            history.innerHTML = "";
            this.value = "";
            return;
        } else if (command === "exit") {
            closeApp('cmd');
            this.value = "";
            return;
        } else if (command === "winver") {
            response = "Microsoft Windows XP Simulator [Version 1.0]\nBuild by Gemini & You";
        } else if (command === "dir") {
            response = " Volume in drive C has no label.\n Directory of C:\\\n\n01/01/2001  12:00 PM    <DIR>          Windows\n01/01/2001  12:00 PM    <DIR>          Documents and Settings\n01/01/2001  12:00 PM    <DIR>          Program Files";
        } else if (command !== "") {
            response = `'${command}' is not recognized as an internal or external command.`;
        }

        // Add to history
        history.innerHTML += `C:\\Documents and Settings\\Guest> ${input}\n${response}\n\n`;
        this.value = "";
        
        // Auto-scroll history
        const body = history.parentElement;
        body.scrollTop = body.scrollHeight;
    }
});

// Auto-focus the input whenever the CMD window is clicked
document.getElementById('cmd').addEventListener('mousedown', () => {
    setTimeout(() => document.getElementById('cmd-input').focus(), 10);
});
