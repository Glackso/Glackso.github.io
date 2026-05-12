const AppManager = {
    // This matches the logic from your old main.js to keep windows unique
    open: function(type, params = {}) {
        if (document.getElementById(type)) {
            focusWindow(type); // If already open, just bring to front
            return;
        }

        const data = AppRegistry[type];
        if (!data) return;

        const win = document.createElement('div');
        win.id = type;
        win.className = 'window active-win'; // Start focused
        win.setAttribute('data-x', '50');
        win.setAttribute('data-y', '50');
        win.style.left = '50px';
        win.style.top = '50px';

        // Salvaged UI structure for the classic look
        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
                    <img src="${data.icon}" width="16" height="16">
                    <span>${data.title}</span>
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="AppManager.minimize('${type}')"></button>
                    <button aria-label="Maximize" ${type === 'minesweeper' ? 'disabled' : ''} onclick="toggleMaximize('${type}')"></button>
                    <button aria-label="Close" onclick="AppManager.close('${type}')"></button>
                </div>
            </div>
            <div class="window-body">${data.generateHTML(params)}</div>
        `;

        document.getElementById('desktop').appendChild(win);
        
        // Restore Interact.js dragging
        interact(win).draggable({
            allowFrom: '.title-bar',
            listeners: { move: dragMoveListener }
        });

        this.addToTaskbar(type, data.title, data.icon);
        focusWindow(type);

        // CRITICAL: This runs the Minesweeper/CMD/Explorer setup logic
        if (data.initGame) data.initGame();
    },

    addToTaskbar: function(id, title, icon) {
        const bar = document.getElementById('taskbar-apps');
        const btn = document.createElement('button');
        btn.id = `taskbar-btn-${id}`;
        btn.className = 'taskbar-btn active';
        btn.onclick = () => {
            const win = document.getElementById(id);
            if (win.style.display === 'none') {
                win.style.display = 'flex';
                focusWindow(id);
            } else {
                focusWindow(id);
            }
        };
        btn.innerHTML = `<img src="${icon}" width="16"> <span>${title}</span>`;
        bar.appendChild(btn);
    },

    close: function(id) {
        document.getElementById(id)?.remove();
        document.getElementById(`taskbar-btn-${id}`)?.remove();
    },

    minimize: function(id) {
        const win = document.getElementById(id);
        if (win) win.style.display = 'none';
        document.getElementById(`taskbar-btn-${id}`)?.classList.remove('active');
    }
};

// Salvaged Dragging Logic
function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// Salvaged Maximize Logic
function toggleMaximize(id) {
    if (id === 'minesweeper') return;
    const win = document.getElementById(id);
    if (!win) return;

    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        win.style.transform = `translate(${win.getAttribute('data-x')}px, ${win.getAttribute('data-y')}px)`;
    } else {
        win.classList.add('maximized');
        win.style.transform = 'none';
    }
}
