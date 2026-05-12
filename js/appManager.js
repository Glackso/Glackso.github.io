const AppManager = {
    open: function(type, params = {}) { // <--- Added params = {} here
        if (document.getElementById(type)) {
            focusWindow(type);
            return;
        }

        const data = AppRegistry[type];
        if (!data) return;

        const win = document.createElement('div');
        win.id = type;
        win.className = 'window active-win';
        
        // Pass params into generateHTML so Notepad can show the text
        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
                    <img src="${data.icon}" width="16">
                    <span>${params.title || data.title}</span>
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Close" onclick="AppManager.close('${type}')"></button>
                </div>
            </div>
            <div class="window-body">${data.generateHTML(params)}</div> 
        `;

        document.getElementById('desktop').appendChild(win);
        
        // Dragging Logic
        interact(win).draggable({
            allowFrom: '.title-bar',
            onmove: (event) => {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        });

        if (data.init) data.init();
        focusWindow(type);
    },
    close: (id) => document.getElementById(id)?.remove()
};
