let highestZIndex = 100; // Global tracking for windows
let openWindows = {};    // Global tracking for open apps

function focusWindow(id) {
    const win = document.getElementById(id);
    if (!win || win.style.display === 'none') return;

    highestZIndex++;
    win.style.zIndex = highestZIndex;

    document.querySelectorAll('.taskbar-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`taskbar-btn-${id}`);
    if (activeBtn) activeBtn.classList.add('active');
}

const AppManager = {
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
            },
            'display-properties': {
    title: "Display Properties",
    icon: "assets/icons/16/display.png",
    html: `
        <div class="display-config">
            <div class="preview-monitor">
                <div id="wallpaper-preview" class="monitor-screen"></div>
            </div>
            <fieldset>
                <legend>Background</legend>
                <div class="wallpaper-list">
                    <button onclick="AppManager.apps.display.preview('bliss')">Bliss</button>
                    <button onclick="AppManager.apps.display.preview('autumn')">Autumn</button>
                    <button onclick="AppManager.apps.display.preview('redmoon')">Red Moon</button>
                </div>
                <div class="display-controls">
                    <button class="xp-btn" onclick="AppManager.apps.display.apply()">Apply</button>
                </div>
            </fieldset>
        </div>`
}
        };
        return apps[type] || null;
    },

    open(type, params = {}) {
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
                    <button aria-label="Maximize" onclick="toggleMaximize('${type}')"></button>
                    <button aria-label="Close" onclick="AppManager.close('${type}')"></button>
                </div>
            </div>
            <div class="window-body">${data.html}</div>
        `;

        document.getElementById('desktop').appendChild(win);
        this.openWindows[type] = true;
        
        if (type === 'computer') renderFiles("C:\\");
        if (type === 'cmd') this.initCMD(win);
        if (type === 'notepad' && params.fileRef) win.fileRef = params.fileRef;
        if (type === 'display-properties') {
    setTimeout(() => this.apps.display.preview(this.apps.display.selectedWallpaper), 50);
}

        this.createTaskbarBtn(type, data.title, data.icon);
        this.makeDraggable(win);
        this.focus(type);
    },

    initCMD(win) {
        const input = win.querySelector('#cmd-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runCommand(input.value);
        });
        win.addEventListener('mousedown', () => setTimeout(() => input.focus(), 10));
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
            highestZIndex++; // Using global variable
            win.style.zIndex = highestZIndex;
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

    apps: {
        notepad: {
            save: function(id) {
    const win = document.getElementById(id);
    const textarea = win.querySelector('#notepad-text');
    let fileName = win.fileRef ? win.fileRef.name : prompt("Save As:", "New Note.txt");
    
    if (!fileName) return;
    if (!fileName.toLowerCase().endsWith('.txt')) fileName += '.txt';

    if (win.fileRef) {
        win.fileRef.content = textarea.value;
    } else {
        const newFile = { name: fileName, type: "file", content: textarea.value };
        driveC["C:\\My Notes"].push(newFile);
        win.fileRef = newFile;
    }

    // UPDATE: Refresh the file explorer if it's open to 'My Notes'
    const currentPath = document.getElementById('current-path')?.innerText;
    if (currentPath === "C:\\My Notes") {
        renderFiles("C:\\My Notes");
    }

    document.getElementById(`${id}-title`).innerText = `${fileName} - Notepad`;
    alert("File Saved to C:\\My Notes");
}
        },
        ie: {
            navigate: function() {
                const url = document.getElementById('ie-address').value;
                document.getElementById('ie-frame').src = url;
            }
        },

        display: {
    selectedWallpaper: 'bliss',
    preview: function(name) {
        this.selectedWallpaper = name;
        const preview = document.getElementById('wallpaper-preview');
        if (preview) {
            preview.style.backgroundImage = `url('assets/wallpapers/${name}.jpg')`;
        }
    },
    apply: function() {
        document.body.style.backgroundImage = `url('assets/wallpapers/${this.selectedWallpaper}.jpg')`;
    }
}
    },

    createTaskbarBtn(id, title, icon) {
        const btn = document.createElement('div');
        btn.id = `taskbar-btn-${id}`;
        btn.className = 'taskbar-btn';
        btn.innerHTML = `<img src="${icon}" width="14"> ${title}`;
        btn.onclick = () => {
            const win = document.getElementById(id);
            if (win.style.display === 'none' || parseInt(win.style.zIndex) < highestZIndex) this.focus(id);
            else this.minimize(id);
        };
        document.getElementById('taskbar-apps').appendChild(btn);
    },

    makeDraggable(el) {
        if (typeof interact === 'undefined') return;
        interact(el).draggable({
            allowFrom: '.title-bar',
            listeners: {
                start: (event) => {
                    focusWindow(event.target.id);
                },
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

const CONFIG = {
    apps: [
        { id: 'computer', name: 'My Computer', icon: 'assets/icons/32/computer.png', startMenu: false },
        { id: 'notepad', name: 'Notepad', icon: 'assets/icons/32/notepad.png', startMenu: true },
        { id: 'cmd', name: 'Command Prompt', icon: 'assets/icons/32/cmd.png', startMenu: true },
        { id: 'internet-explorer', name: 'Internet Explorer', icon: 'assets/icons/32/ie.png', startMenu: true },
        { id: 'display-properties', name: 'Display Properties', icon: 'assets/icons/32/display.png', startMenu: true }
    ]
};

function renderShortcuts() {
    const desktopGrid = document.querySelector('.icon-grid');
    const startLeft = document.querySelector('.start-menu-left');
    
    if (!desktopGrid || !startLeft) return;

    desktopGrid.innerHTML = '';
    startLeft.innerHTML = '';

    CONFIG.apps.forEach(app => {
        // Render Desktop Icons
        const desktopIcon = document.createElement('div');
        desktopIcon.className = 'shortcut';
        desktopIcon.innerHTML = `
            <img src="${app.icon}">
            <span>${app.name}</span>
        `;
        desktopIcon.ondblclick = () => AppManager.open(app.id);
        desktopGrid.appendChild(desktopIcon);

        // Render Start Menu Shortcuts
        if (app.startMenu) {
            const startItem = document.createElement('div');
            startItem.className = 'start-item';
            startItem.innerHTML = `
                <img src="${app.icon}" width="24">
                <span style="font-weight: bold;">${app.name}</span>
            `;
            startItem.onclick = () => {
                AppManager.open(app.id);
                toggleStartMenu();
            };
            startLeft.appendChild(startItem);
        }
    });
}

// Make sure toggleStartMenu is also defined if it's missing
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

function renderFiles(path) {
    const viewer = document.getElementById('file-viewer');
    const pathDisplay = document.getElementById('current-path');
    if (!viewer) return;

    viewer.innerHTML = '';
    pathDisplay.innerText = path;

    const items = driveC[path] || [];

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'file-item';
        const icon = item.type === 'folder' ? 'assets/icons/16/folder.png' : 'assets/icons/16/notepad.png';
        
        li.innerHTML = `<img src="${icon}"> ${item.name}`;
        
        li.ondblclick = () => {
            if (item.type === 'folder') {
                renderFiles(`${path}${item.name}\\`);
            } else {
                AppManager.open('notepad', { 
                    fileName: item.name, 
                    content: item.content, 
                    fileRef: item 
                });
            }
        };
        viewer.appendChild(li);
    });
}

function goBack() {
    renderFiles("C:\\"); // Simple version: always goes back to root
}

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    // Close any other open dropdowns first
    document.querySelectorAll('.dropdown').forEach(d => {
        if (d.id !== menuId) d.style.display = 'none';
    });
    
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

// Close menus if you click anywhere else on the desktop
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-bar')) {
        document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
});

function runCommand(input) {
    const history = document.getElementById('cmd-history');
    const cmdInput = document.getElementById('cmd-input');
    const command = input.toLowerCase().trim();
    let response = "";

    if (command === "dir") {
        // Look at the filesystem.js driveC object
        const files = driveC["C:\\"] || [];
        response = " Directory of C:\\\n\n" + files.map(f => 
            `${f.type === 'folder' ? '<DIR>          ' : '               '} ${f.name}`
        ).join('\n');
    } else if (command === "cls") {
        history.innerHTML = "";
        cmdInput.value = "";
        return;
    } else if (command === "winver") {
        response = "Microsoft Windows XP [Version 5.1.2600]";
    } else if (command === "help") {
        response = "Available commands: DIR, CLS, WINVER, HELP, EXIT";
    } else if (command === "exit") {
        AppManager.close('cmd');
        return;
    } else if (command !== "") {
        response = `'${command}' is not recognized as an internal or external command.`;
    }

    history.innerHTML += `C:\\> ${input}\n${response}\n\n`;
    cmdInput.value = "";
    
    // Auto-scroll to the bottom of the CMD window
    const body = document.querySelector('.cmd-body');
    if (body) body.scrollTop = body.scrollHeight;
}

function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (win.classList.contains('maximized')) {
        // Restore
        win.classList.remove('maximized');
        win.style.width = ""; // Returns to CSS default
        win.style.height = "";
        win.style.transform = `translate(${win.getAttribute('data-x') || 0}px, ${win.getAttribute('data-y') || 0}px)`;
    } else {
        // Maximize
        win.classList.add('maximized');
        win.style.width = "100vw";
        win.style.height = "calc(100vh - 30px)"; // Subtract taskbar height
        win.style.top = "0";
        win.style.left = "0";
        win.style.transform = "none";
    }
}

function bootSystem() {
    renderShortcuts();
    setInterval(() => {
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }, 1000);
}

bootSystem();
