let openWindows = {};

function openApp(id, title = "App", iconSrc = "assets/icons/32/computer.png") {
    const win = document.getElementById(id);
    if (!win) return;
    
    // Bring to front
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 10);
    win.style.zIndex = 20;
    win.style.display = 'block';
    
    // Setup File Explorer if needed
    if (id === 'my-computer') renderFiles("C:\\");
    
    // Taskbar Logic
    if (!openWindows[id]) {
        openWindows[id] = true;
        const taskbarApps = document.getElementById('taskbar-apps');
        const btn = document.createElement('div');
        btn.className = 'taskbar-btn active';
        btn.id = `taskbar-btn-${id}`;
        btn.innerHTML = `<img src="${iconSrc}" style="width: 14px; margin-right: 5px;" onerror="this.style.display='none'"> ${title}`;
        
        btn.onclick = () => {
            if (win.style.display === 'none') {
                win.style.display = 'block';
                win.style.zIndex = 20;
                btn.classList.add('active');
            } else {
                win.style.display = 'none';
                btn.classList.remove('active');
            }
        };
        taskbarApps.appendChild(btn);
    }
}

function closeApp(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    if (openWindows[id]) {
        delete openWindows[id];
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (btn) btn.remove();
    }
}

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

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.menu-bar')) {
        document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
});

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

if (typeof interact !== 'undefined') {
    interact('.draggable').draggable({
        allowFrom: '.title-bar',
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
    console.error("Interact.js failed to load. Check your js/interact.min.js path!");
}
