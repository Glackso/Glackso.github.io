function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
}

function renderShortcuts() {
    const grid = document.querySelector('.icon-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const shortcuts = [
        { name: "My Computer", icon: "assets/icons/32/computer.png", type: "computer" },
        { name: "Minesweeper", icon: "assets/icons/32/minesweeper.png", type: "minesweeper" },
        { name: "Notepad", icon: "assets/icons/32/notepad.png", type: "notepad" }
    ];

    shortcuts.forEach(s => {
        const div = document.createElement('div');
        div.className = 'shortcut';
        div.onclick = () => AppManager.open(s.type);
        div.innerHTML = `<img src="${s.icon}"><p>${s.name}</p>`;
        grid.appendChild(div);
    });
}

// Global click handler to close menu and focus windows
document.addEventListener('mousedown', (e) => {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-button');
    if (startMenu.style.display === 'flex' && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.style.display = 'none';
    }
    
    const win = e.target.closest('.window');
    if (win) focusWindow(win.id);
});

const ContextMenu = {
    show: function(e) {
        e.preventDefault();
        const menu = document.getElementById('context-menu');
        menu.style.display = 'block';
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        
        if (e.target.closest('.desktop')) {
            menu.innerHTML = `
                <div class="menu-item" onclick="AppManager.open('notepad')">New Text Document</div>
                <div class="menu-item" onclick="AppManager.open('display')">Properties</div>
            `;
        } else {
            this.hide();
        }
    },
    hide: function() {
        const menu = document.getElementById('context-menu');
        if (menu) menu.style.display = 'none';
    }
};

// Global Listeners for the UI
document.addEventListener('contextmenu', ContextMenu.show);
document.addEventListener('click', (e) => {
    ContextMenu.hide();
    // Hide start menu if clicking outside
    if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
        document.getElementById('start-menu').style.display = 'none';
    }
});
