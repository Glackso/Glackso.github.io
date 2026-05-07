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

// --- App Controls ---
function openApp(id, title = "App", iconSrc = "assets/icons/32/computer.png") {
    const win = document.getElementById(id);
    if (!win) return;
    
    win.style.display = 'block';
    if (id === 'my-computer') renderFiles("C:\\");
    
    // Create Taskbar Button if it doesn't exist
    if (!openWindows[id]) {
        openWindows[id] = true;
        const taskbarApps = document.getElementById('taskbar-apps');
        const btn = document.createElement('div');
        btn.id = `taskbar-btn-${id}`;
        btn.className = 'taskbar-btn';
        btn.innerHTML = `<img src="${iconSrc}" style="width: 14px; margin-right: 5px;" onerror="this.style.display='none'"> ${title}`;
        
        btn.onclick = () => {
            if (win.style.display === 'none') {
                // If minimized, show and focus
                win.style.display = 'block';
                focusWindow(id);
            } else if (win.style.zIndex < highestZIndex) {
                // If behind another window, just bring to front
                focusWindow(id);
            } else {
                // If it's already the front-most window, minimize it
                minimizeApp(id);
            }
        };
        taskbarApps.appendChild(btn);
    }
    
    focusWindow(id); // Automatically focus when opened
}

function closeApp(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
        win.classList.remove('maximized'); // Reset full screen on close
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
    
    // Remove active styling from taskbar button since it's minimized
    const btn = document.getElementById(`taskbar-btn-${id}`);
    if (btn) btn.classList.remove('active');
}

function maximizeApp(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.toggle('maximized');
        focusWindow(id); // Ensure it's active when maximized
    }
}

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

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

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
