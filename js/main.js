let openWindows = {};
let highestZIndex = 100;

// --- 1. OS Boot & Login Logic ---
function login() {
    const screen = document.getElementById('login-screen');
    if (screen) {
        screen.style.opacity = '0';
        setTimeout(() => {
            screen.style.display = 'none';
        }, 500);
    }
}

// --- 2. Window Management (Focus, Open, Close, Min/Max) ---
function focusWindow(id) {
    const win = document.getElementById(id);
    if (!win || win.style.display === 'none') return;

    highestZIndex++;
    win.style.zIndex = highestZIndex;

    // Update Taskbar Active State
    document.querySelectorAll('.taskbar-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`taskbar-btn-${id}`);
    if (activeBtn) activeBtn.classList.add('active');
}

function openApp(id, title = "App", iconSrc = "assets/icons/16/computer.png") {
    const win = document.getElementById(id);
    if (!win) return;
    
    win.style.display = 'block';
    
    // Initialize specific apps
    if (id === 'my-computer') renderFiles("C:\\");
    
    // Manage Taskbar Button
    if (!openWindows[id]) {
        openWindows[id] = true;
        const taskbarApps = document.getElementById('taskbar-apps');
        const btn = document.createElement('div');
        btn.id = `taskbar-btn-${id}`;
        btn.className = 'taskbar-btn';
        btn.innerHTML = `<img src="${iconSrc}" style="width: 14px; margin-right: 5px;" onerror="this.src='https://winxp.vercel.app/icons/notepad.png'"> ${title}`;
        
        btn.onclick = () => {
            if (win.style.display === 'none') {
                win.style.display = 'block';
                focusWindow(id);
            } else if (parseInt(win.style.zIndex) < highestZIndex) {
                focusWindow(id);
            } else {
                minimizeApp(id);
            }
        };
        taskbarApps.appendChild(btn);
    }
    
    focusWindow(id);
}

function closeApp(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
        win.classList.remove('maximized');
    }
    if (openWindows[id]) {
        delete openWindows[id];
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (btn) btn.remove();
    }
}

function minimizeApp(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    const btn = document.getElementById(`taskbar-btn-${id}`);
    if (btn) btn.classList.remove('active');
}

function maximizeApp(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.toggle('maximized');
        focusWindow(id);
    }
}

// --- 3. Internet Explorer Logic ---
function navigateIE() {
    const urlInput = document.getElementById('ie-address');
    const frame = document.getElementById('ie-frame');
    let url = urlInput.value;

    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    frame.src = url;
}

// --- 4. Command Prompt Logic ---
// We use a dedicated function to handle the logic when Enter is pressed
function initCMD() {
    const inputField = document.getElementById('cmd-input');
    if (!inputField) return;

    inputField.addEventListener('keydown', function(e) {
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
                response = "Microsoft Windows XP Simulator [Version 1.0]";
            } else if (command === "dir") {
                response = " Directory of C:\\\n\n01/01/2001  12:00 PM    <DIR>          Windows\n01/01/2001  12:00 PM    <DIR>          Documents and Settings\n01/01/2001  12:00 PM    <DIR>          Program Files";
            } else if (command !== "") {
                response = `'${command}' is not recognized as an internal or external command.`;
            }

            history.innerHTML += `C:\\Documents and Settings\\Guest> ${input}\n${response}\n\n`;
            this.value = "";
            
            // Auto-scroll history to bottom
            const body = history.parentElement;
            body.scrollTop = body.scrollHeight;
        }
    });

    // Auto-focus input when clicking anywhere in the CMD window
    document.getElementById('cmd').addEventListener('mousedown', () => {
        setTimeout(() => inputField.focus(), 10);
    });
}

// --- 5. Desktop Interaction (Selection & Start Menu) ---
function selectIcon(element, event) {
    event.stopPropagation();
    if (!event.ctrlKey) {
        document.querySelectorAll('.shortcut').forEach(el => el.classList.remove('selected'));
    }
    element.classList.add('selected');
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Global click handler to close menus/deselect icons
document.addEventListener('click', function(event) {
    // Close Start Menu
    if (!event.target.closest('#start-menu') && !event.target.closest('.start-button')) {
        const startMenu = document.getElementById('start-menu');
        if(startMenu) startMenu.style.display = 'none';
    }
    // Deselect Desktop Icons
    if (!event.target.closest('.shortcut') && !event.target.closest('.window')) {
        document.querySelectorAll('.shortcut').forEach(el => el.classList.remove('selected'));
    }
    // Close Notepad Dropdowns
    if (!event.target.closest('.menu-bar')) {
        document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
});

// --- 6. Core Initialization ---
window.onload = () => {
    initCMD();
    
    // Start Clock
    setInterval(() => {
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }, 1000);
};

// --- 7. Interact.js Integration ---
if (typeof interact !== 'undefined') {
    interact('.draggable').draggable({
        allowFrom: '.title-bar',
        listeners: {
            start(event) { focusWindow(event.target.id); },
            move(event) {
                const target = event.target;
                if (target.classList.contains('maximized')) return;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });

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
}

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    // Remove existing menu if it exists
    const oldMenu = document.getElementById('custom-context-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.className = 'window'; 
    menu.style.cssText = `position:absolute; left:${e.pageX}px; top:${e.pageY}px; z-index:9999; padding:2px; background:#ece9d8; border:1px solid #716f64; box-shadow:2px 2px 2px rgba(0,0,0,0.3); width:150px;`;
    
    menu.innerHTML = `
        <div class="start-item" onclick="location.reload()" style="padding:2px 10px;">Refresh</div>
        <div style="border-top:1px solid #aca899; margin:2px 0;"></div>
        <div class="start-item" onclick="createNewTextFile()" style="padding:2px 10px;">New Text Document</div>
        <div class="start-item" onclick="toggleWallpaper()" style="padding:2px 10px;">Next Wallpaper</div>
        <div style="border-top:1px solid #aca899; margin:2px 0;"></div>
        <div class="start-item" style="padding:2px 10px; color:gray;">Properties</div>
    `;
    
    document.body.appendChild(menu);
    document.addEventListener('click', () => menu.remove(), {once: true});
});

// Helper functions for the menu
function toggleWallpaper() {
    const body = document.body;
    const wallpapers = [
        'url("assets/wallpapers/bliss.jpg")',
        'url("assets/wallpapers/autumn.jpg")',
        'url("assets/wallpapers/redmoon.jpg")'
    ];
    let current = body.style.backgroundImage;
    let nextIndex = (wallpapers.indexOf(current) + 1) % wallpapers.length;
    body.style.backgroundImage = wallpapers[nextIndex];
}

function createNewTextFile() {
    const currentPath = document.getElementById('current-path').innerText || "C:\\";
    const newFile = { name: "New Document.txt", type: "file", content: "" };
    if (driveC[currentPath]) {
        driveC[currentPath].push(newFile);
        renderFiles(currentPath);
    }
}

// hi!
