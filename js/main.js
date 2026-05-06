// Keep track of open apps for the taskbar
let openWindows = {};

function openApp(id, title = "App", iconSrc = "https://winxp.vercel.app/icons/notepad.png") {
    const win = document.getElementById(id);
    if (!win) return;
    
    win.style.display = 'block';
    
    // Add to taskbar if it isn't already there
    if (!openWindows[id]) {
        openWindows[id] = true;
        const taskbarApps = document.getElementById('taskbar-apps');
        const btn = document.createElement('div');
        btn.className = 'taskbar-btn active';
        btn.id = `taskbar-btn-${id}`;
        btn.innerHTML = `<img src="${iconSrc}" style="width: 14px; margin-right: 5px;"> ${title}`;
        
        // Clicking taskbar button toggles visibility
        btn.onclick = () => {
            win.style.display = win.style.display === 'none' ? 'block' : 'none';
        };
        taskbarApps.appendChild(btn);
    }
}

function closeApp(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    
    // Remove from taskbar
    if (openWindows[id]) {
        delete openWindows[id];
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (btn) btn.remove();
    }
}

// System Clock
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

// Basic dropdown menu toggler
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Close menus when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.menu-bar')) {
        document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
});

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
