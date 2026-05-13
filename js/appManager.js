const AppManager = {
    registry: {},

    // Register a new app to the system
    registerApp: function(appId, appConfig) {
        this.registry[appId] = appConfig;
        this.createDesktopIcon(appId, appConfig);
    },

    // Dynamically build the desktop icon
    createDesktopIcon: function(appId, config) {
        const desktop = document.getElementById('desktop');
        const iconDiv = document.createElement('div');
        iconDiv.className = 'desktop-icon';
        
        // Double click opens the app
        iconDiv.ondblclick = () => this.openApp(appId);
        
        iconDiv.innerHTML = `
            <img src="${config.icon32}" alt="${config.name}" onerror="this.src='https://via.placeholder.com/32'">
            <span>${config.name}</span>
        `;
        desktop.appendChild(iconDiv);
    },

    // Generate the window and make it draggable
    openApp: function(appId) {
        const config = this.registry[appId];
        if (!config) return;

        // Prevent opening duplicates if you want (optional logic goes here)

        const win = document.createElement('div');
        win.className = 'xp-window draggable';
        win.id = `win-${appId}`;
        
        // Window Structure
        win.innerHTML = `
            <div class="xp-titlebar window-header">
                <div class="title-info">
                    <img src="${config.icon16}" width="16" height="16" onerror="this.src='https://via.placeholder.com/16'">
                    <span>${config.name}</span>
                </div>
                <div class="xp-controls">
                    <button class="xp-close" onclick="this.closest('.xp-window').remove()">X</button>
                </div>
            </div>
            <div class="xp-window-content">
                ${config.contentHTML}
            </div>
        `;

        document.getElementById('desktop').appendChild(win);

        // Make window draggable using interact.min.js
        if (typeof interact !== 'undefined') {
            interact(win).draggable({
                allowFrom: '.window-header', // Only drag by the titlebar
                listeners: {
                    move(event) {
                        const target = event.target;
                        // Keep track of coordinates
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // Translate the element
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        
                        // Update data attributes
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                }
            });
        } else {
            console.warn("interact.min.js is not loaded!");
        }
    }
};
