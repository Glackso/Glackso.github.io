/**
 * AppManager: Handles the lifecycle of windows and desktop icons.
 */
const AppManager = {
    registry: {},

    // Register an app so the system knows it exists
    registerApp(id, config) {
        this.registry[id] = config;
        this.renderDesktopIcon(id, config);
    },

    // Create the icon on the desktop
    renderDesktopIcon(id, config) {
        const desktop = document.getElementById('desktop');
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.ondblclick = () => this.openApp(id);
        
        icon.innerHTML = `
            <img src="${config.icon || 'assets/icons/32/file.png'}" alt="${config.title}">
            <span>${config.title}</span>
        `;
        desktop.appendChild(icon);
    },

    // Build the window using the user-provided xp.css structure
    openApp(id) {
        const app = this.registry[id];
        if (!app) return;

        const win = document.createElement('div');
        win.className = 'window draggable';
        win.style.width = app.width || "400px";
        win.style.position = "absolute";
        win.style.left = "50px";
        win.style.top = "50px";
        win.style.zIndex = UI.getNextZIndex(); // Handled by UI script

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">${app.title}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" class="close-btn"></button>
                </div>
            </div>
            <div class="window-body">
                ${app.content}
            </div>
        `;

        document.getElementById('desktop').appendChild(win);

        // Functional Close Button
        win.querySelector('.close-btn').onclick = () => win.remove();

        // Bring to front on click
        win.onmousedown = () => {
            win.style.zIndex = UI.getNextZIndex();
        };

        this.initDragging(win);
    },

    initDragging(el) {
        interact(el).draggable({
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
    }
};
