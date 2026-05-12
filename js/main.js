let highestZIndex = 100; // Global tracking for windows
let openWindows = {}; // Global tracking for open apps

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
                
                <div style="margin-top:10px;">
                    <label class="xp-btn" style="display:inline-block; cursor:pointer; border:1px solid #7f9db9; padding:2px 5px; background:#f0f0f0;">
                        Upload Custom...
                        <input type="file" id="wallpaper-upload" accept="image/*" style="display:none" onchange="AppManager.apps.display.handleUpload(this)">
                    </label>
                    <p style="font-size:10px; color:#666; margin-top:5px;">Best size: 1920x1080</p>
                </div>

                <div class="display-controls">
                    <button class="xp-btn" onclick="AppManager.apps.display.apply()">Apply</button>
                </div>
            </fieldset>
        </div>`
},
'minesweeper': {
    title: "Minesweeper",
    icon: "assets/icons/16/minesweeper.png",
    html: `
        <div class="minesweeper-container">
            <div class="ms-header">
                <div class="ms-counter" id="mine-count">010</div>
                <div class="ms-face" id="ms-face" onclick="AppManager.apps.minesweeper.init()"></div>
                <div class="ms-counter" id="ms-timer">000</div>
            </div>
            <div id="ms-grid" class="ms-grid"></div>
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


        const isMinesweeper = type === 'minesweeper';

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
              <img src="${data.icon}" width="14" onerror="this.style.display='none'"> 
              <span id="${type}-title">${data.title}</span>
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="AppManager.minimize('${type}')"></button>
                    <button aria-label="Maximize" 
                            ${isMinesweeper ? 'style="opacity: 0.5; pointer-events: none;"' : ''} 
                            onclick="toggleMaximize('${type}')"></button>
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
        if (type === 'minesweeper') {
            setTimeout(() => this.apps.minesweeper.init(), 100);
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

    let savedFile;
    if (win.fileRef) {
        // Update existing file
        win.fileRef.content = textarea.value;
        savedFile = win.fileRef;
    } else {
        // Create new file object
        savedFile = { name: fileName, type: "file", content: textarea.value };
        
        // Add to My Notes by default if it's a new file
        if (!driveC["C:\\My Notes"]) driveC["C:\\My Notes"] = [];
        driveC["C:\\My Notes"].push(savedFile);
        win.fileRef = savedFile;
    }

    // --- RECENT DOCUMENTS LOGIC ---
    if (!driveC["C:\\Recent"]) driveC["C:\\Recent"] = [];
    
    // Remove if already exists to move to top
    driveC["C:\\Recent"] = driveC["C:\\Recent"].filter(f => f.name !== fileName);
    driveC["C:\\Recent"].unshift(savedFile); // Add to top
    if (driveC["C:\\Recent"].length > 10) driveC["C:\\Recent"].pop(); 

    // --- REFRESH VIEWER IF OPEN ---
    const currentPath = document.getElementById('current-path')?.innerText;
    if (currentPath) renderFiles(currentPath);

    document.getElementById(`${id}-title`).innerText = `${fileName} - Notepad`;
    alert("File Saved to C:\\My Notes and Recent Documents");
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
    isCustom: false,
    customUrl: '',

    preview: function(name) {
        this.isCustom = false;
        this.selectedWallpaper = name;
        const preview = document.getElementById('wallpaper-preview');
        if (preview) {
            preview.style.backgroundImage = `url('assets/wallpapers/${name}.jpg')`;
        }
    },

    handleUpload: function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.isCustom = true;
                this.customUrl = e.target.result;
                // Update the small monitor preview immediately
                const preview = document.getElementById('wallpaper-preview');
                if (preview) {
                    preview.style.backgroundImage = `url(${this.customUrl})`;
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    apply: function() {
        const url = this.isCustom ? this.customUrl : `assets/wallpapers/${this.selectedWallpaper}.jpg`;
        document.body.style.backgroundImage = `url(${url})`;
        alert("Wallpaper applied successfully!");
    }
},minesweeper: {
    rows: 9, cols: 9, mines: 10,
    grid: [], gameOver: false, 
    flagsPlaced: 0, timer: 0, timerInterval: null,

    init: function() {
        this.gameOver = false;
        this.flagsPlaced = 0;
        this.timer = 0;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        
        this.updateCounter('mine-count', this.mines);
        this.updateCounter('ms-timer', 0);
        
        const face = document.getElementById('ms-face');
        if (face) face.style.backgroundImage = "url('assets/minesweeper/face/normal.png')";
        
        // Handle face "clicked" state (Reset button)
        if (face) {
            face.onmousedown = () => face.style.backgroundImage = "url('assets/minesweeper/face/clicked.png')";
            face.onmouseup = () => face.style.backgroundImage = "url('assets/minesweeper/face/normal.png')";
        }

        this.createGrid(); // Now this function actually exists below
    },

    createGrid: function() {
        const gridEl = document.getElementById('ms-grid');
        const face = document.getElementById('ms-face');
        if (!gridEl) return;

        gridEl.innerHTML = '';
        this.grid = [];

        // 1. Create Logic Grid & Elements
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const tile = document.createElement('div');
                tile.className = 'ms-tile';
                
                tile.onmousedown = () => { 
                    if(!this.gameOver) face.style.backgroundImage = "url('assets/minesweeper/face/click.png')"; 
                };
                tile.onmouseup = () => { 
                    if(!this.gameOver) face.style.backgroundImage = "url('assets/minesweeper/face/normal.png')"; 
                };
                tile.onclick = () => this.reveal(r, c);
                tile.oncontextmenu = (e) => { e.preventDefault(); this.flag(r, c); };
                
                gridEl.appendChild(tile);
                this.grid[r][c] = { isMine: false, revealed: false, flagged: false, count: 0, el: tile };
            }
        }

        // 2. Place Mines
        let placed = 0;
        while (placed < this.mines) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);
            if (!this.grid[r][c].isMine) {
                this.grid[r][c].isMine = true;
                placed++;
            }
        }

        // 3. Calculate Numbers
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (this.grid[r + i]?.[c + j]?.isMine) count++;
                    }
                }
                this.grid[r][c].count = count;
            }
        }
    },

    reveal: function(r, c) {
        if (this.gameOver || this.grid[r][c].revealed || this.grid[r][c].flagged) return;
        
        if (this.timer === 0) this.startTimer();

        const cell = this.grid[r][c];
        cell.revealed = true;
        cell.el.classList.add('revealed');
        
        if (cell.isMine) {
            this.explode(r, c);
            return;
        }

        if (cell.count > 0) {
            cell.el.style.backgroundImage = `url('assets/minesweeper/tile/${cell.count}.png')`;
        } else {
            cell.el.style.backgroundImage = `url('assets/minesweeper/tile/tilenone.png')`;
            // Flood fill for empty tiles
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (this.grid[r+i]?.[c+j]) this.reveal(r+i, c+j);
                }
            }
        }
        this.checkWin();
    },

    flag: function(r, c) {
        if (this.gameOver || this.grid[r][c].revealed) return;
        const cell = this.grid[r][c];
        
        cell.flagged = !cell.flagged;
        this.flagsPlaced += cell.flagged ? 1 : -1;
        this.updateCounter('mine-count', this.mines - this.flagsPlaced);
        
        cell.el.style.backgroundImage = cell.flagged ? 
            "url('assets/minesweeper/tile/flag.png')" : 
            "url('assets/minesweeper/tile/tile.png')";
        
        playSound('click');
    },

    explode: function(r, c) {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        document.getElementById('ms-face').style.backgroundImage = "url('assets/minesweeper/face/lose.png')";
        this.grid[r][c].el.style.backgroundImage = "url('assets/minesweeper/tile/clickedmine.png')";
        
        this.grid.forEach(row => row.forEach(cell => {
            if (cell.isMine && !cell.flagged) cell.el.style.backgroundImage = "url('assets/minesweeper/tile/mine.png')";
            if (!cell.isMine && cell.flagged) cell.el.style.backgroundImage = "url('assets/minesweeper/tile/wrong.png')";
        }));
    }, // Added missing comma

    updateCounter: function(elementId, value) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    const val = Math.min(Math.max(value, 0), 999);
    // Convert to string
    let valStr = val.toString();
    
    // Create the 3-digit array
    // Example: val 5 becomes ["none", "none", "5"]
    // Example: val 50 becomes ["none", "5", "0"]
    let displayDigits = ["none", "none", "none"];
    
    if (valStr.length === 1) {
        displayDigits[2] = valStr[0];
    } else if (valStr.length === 2) {
        displayDigits[1] = valStr[0];
        displayDigits[2] = valStr[1];
    } else {
        displayDigits = valStr.split('');
    }

    container.innerHTML = '';
    displayDigits.forEach(d => {
        const digitDiv = document.createElement('div');
        digitDiv.className = 'digit-box';
        // d will be "none", "0", "1", etc.
        digitDiv.style.backgroundImage = `url('assets/minesweeper/number/${d}.png')`;
        container.appendChild(digitDiv);
    });
},

    startTimer: function() {
        if (this.timerInterval) return;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateCounter('ms-timer', this.timer);
            if (this.timer >= 999) clearInterval(this.timerInterval);
        }, 1000);
    },

    checkWin: function() {
        let unrevealedSafeTiles = 0;
        this.grid.forEach(row => row.forEach(cell => {
            if (!cell.isMine && !cell.revealed) unrevealedSafeTiles++;
        }));

        if (unrevealedSafeTiles === 0) {
            this.gameOver = true;
            clearInterval(this.timerInterval);
            document.getElementById('ms-face').style.backgroundImage = "url('assets/minesweeper/face/win.png')";
            this.updateCounter('mine-count', 0);
        }
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
    apps: [{
            id: 'computer',
            name: 'My Computer',
            icon: 'assets/icons/32/computer.png',
            startMenu: false
        },
        {
            id: 'notepad',
            name: 'Notepad',
            icon: 'assets/icons/32/notepad.png',
            startMenu: true
        },
        {
            id: 'cmd',
            name: 'Command Prompt',
            icon: 'assets/icons/32/cmd.png',
            startMenu: true
        },
        {
            id: 'internet-explorer',
            name: 'Internet Explorer',
            icon: 'assets/icons/32/ie.png',
            startMenu: true
        },
        {
            id: 'display-properties',
            name: 'Display Properties',
            icon: 'assets/icons/32/display.png',
            startMenu: true
        },
        { id: 'minesweeper', name: 'Minesweeper', icon: 'assets/icons/32/minesweeper.png', startMenu: true }
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

    // Ensure we get the array for the current path
    const items = driveC[path] || [];

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        // Pick icon based on type
        const iconSrc = item.type === 'folder' 
            ? 'assets/icons/16/folder.png' 
            : 'assets/icons/16/notepad.png';
        
        li.innerHTML = `<img src="${iconSrc}" width="16"> ${item.name}`;
        
        li.ondblclick = () => {
            playSound('click'); // Play sound on interaction
            
            if (item.type === 'folder') {
                // Handle folder navigation
                const newPath = path.endsWith('\\') ? `${path}${item.name}` : `${path}\\${item.name}`;
                renderFiles(newPath);
            } else {
                // Handle opening files (Notepad)
                AppManager.open('notepad', { 
                    fileName: item.name, 
                    content: item.content || '', 
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

function playSound(soundName) {
    const audio = new Audio(`assets/sounds/${soundName}.wav`);
    audio.play().catch(e => console.log("Sound play blocked until user interacts with page."));
}

function bootSystem() {
    renderShortcuts();
    setInterval(() => {
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.innerText = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }, 1000);
}

bootSystem();
