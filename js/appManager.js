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
        win.className = 'window active-win';
        win.style.left = '100px';
        win.style.top = '100px';
        params.id = type;

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
                    <img src="${data.icon}" width="16">
                    <span>${data.title}</span>
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="AppManager.minimize('${type}')"></button>
                    <button aria-label="Maximize" onclick="toggleMaximize('${type}')"></button>
                    <button aria-label="Close" onclick="AppManager.close('${type}')"></button>
                </div>
            </div>
            <div class="window-body">${data.generateHTML(params)}</div>
        `;

        document.getElementById('desktop').appendChild(win);
        
        interact(win).draggable({
            allowFrom: '.title-bar',
            listeners: { move: dragMoveListener }
        });

        this.addToTaskbar(type, data.title, data.icon);
        focusWindow(type);
        if (data.initGame) data.initGame();
    },

    close: function(id) {
        document.getElementById(id)?.remove();
        document.getElementById(`taskbar-btn-${id}`)?.remove();
    },

    minimize: function(id) {
        const win = document.getElementById(id);
        if (win) win.style.display = 'none';
        document.getElementById(`taskbar-btn-${id}`)?.classList.remove('active');
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
    }
};

function toggleMaximize(id) {
    if (id === 'minesweeper') return;
    const win = document.getElementById(id);
    win.classList.toggle('maximized');
}

function dragMoveListener(event) {
    let target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
