const AppManager = {
    open: function(type, params = {}) {
        if (document.getElementById(type)) {
            focusWindow(type);
            return;
        }

        const data = AppRegistry[type];
        if (!data) return;

        const win = document.createElement('div');
        win.id = type;
        win.className = 'window';
        win.setAttribute('data-x', '50');
        win.setAttribute('data-y', '50');
        win.style.left = '50px';
        win.style.top = '50px';

        const isMinesweeper = type === 'minesweeper';

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
                    <img src="${data.icon}" width="14"> 
                    <span>${data.title}</span>
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="AppManager.minimize('${type}')"></button>
                    <button aria-label="Maximize" 
                            ${isMinesweeper ? 'style="opacity: 0.5; pointer-events: none;"' : ''} 
                            onclick="toggleMaximize('${type}')"></button>
                    <button aria-label="Close" onclick="AppManager.close('${type}')"></button>
                </div>
            </div>
            <div class="window-body">${data.generateHTML(params)}</div>
        `;

        document.getElementById('desktop').appendChild(win);
        
        // Setup Interact.js dragging
        interact(win).draggable({
            allowFrom: '.title-bar',
            listeners: { move: dragMoveListener }
        });

        this.addToTaskbar(type, data.title, data.icon);
        focusWindow(type);

        // Run app-specific init logic (like Minesweeper game start)
        if (data.initGame) data.initGame();
    },

    addToTaskbar: function(id, title, icon) {
        const btn = document.createElement('button');
        btn.id = `taskbar-btn-${id}`;
        btn.className = 'taskbar-btn active';
        btn.onclick = () => focusWindow(id);
        btn.innerHTML = `<img src="${icon}" width="16"> <span>${title}</span>`;
        document.getElementById('taskbar-apps').appendChild(btn);
    },

    close: function(id) {
        const win = document.getElementById(id);
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (win) win.remove();
        if (btn) btn.remove();
    },

    minimize: function(id) {
        const win = document.getElementById(id);
        if (win) win.style.display = 'none';
        document.getElementById(`taskbar-btn-${id}`).classList.remove('active');
    }
};

function dragMoveListener(event) {
    let target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // Boundary check
    const maxX = window.innerWidth - target.offsetWidth;
    const maxY = window.innerHeight - 30 - target.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function toggleMaximize(id) {
    if (id === 'minesweeper') return;
    const win = document.getElementById(id);
    win.classList.toggle('maximized');
}
