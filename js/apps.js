const WindowManager = {
    open: function(appKey) {
        const data = SystemFiles[appKey];
        if (!data) return;

        const win = document.createElement('div');
        win.className = 'window'; // xp.css standard
        win.style.width = '400px';
        win.style.position = 'absolute';
        win.style.top = '50px';
        win.style.left = '50px';

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">
                    <img src="${data.icon}" style="width:16px; vertical-align:middle; margin-right:4px;">
                    ${data.title}
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onclick="this.closest('.window').remove()"></button>
                </div>
            </div>
            <div class="window-body">
                ${data.content}
            </div>
        `;

        document.getElementById('window-layer').appendChild(win);

        // Link with interact.min.js for movement
        if (typeof interact !== 'undefined') {
            this.makeDraggable(win);
        }
    },

    makeDraggable: function(el) {
        interact(el).draggable({
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
    }
};
