// ================= CORE OS ENGINE =================
const AppRegistry = {}; 
let globalZIndex = 10;
let openProcesses = {};

const SystemEngine = {
    init: function() {
        this.renderDesktop();
        // Play startup sound on first click anywhere (to bypass browser audio block)
        document.body.addEventListener('click', function initAudio() {
            AudioEngine.play('startup');
            document.body.removeEventListener('click', initAudio);
        });
    },

    // When you create an app, it auto-installs to the Desktop
    registerApp: function(appId, appConfig) {
        AppRegistry[appId] = appConfig;
        FileSystem.desktop.push({ id: appId, title: appConfig.title, isApp: true });
        this.renderDesktop(); // Refresh the desktop icons
    },

    renderDesktop: function() {
        const desktopEl = document.getElementById('desktop');
        if (!desktopEl) return;

        desktopEl.innerHTML = '<div id="alpha-watermark" style="position:absolute; bottom:10px; right:10px; color:rgba(255,255,255,0.5); font-weight:bold;">v0.1 Alpha</div>';

        let topPos = 10;
        let leftPos = 10;

        FileSystem.desktop.forEach(item => {
            const icon = document.createElement('div');
            icon.style.position = 'absolute';
            icon.style.top = `${topPos}px`;
            icon.style.left = `${leftPos}px`;
            icon.style.width = '64px';
            icon.style.display = 'flex';
            icon.style.flexDirection = 'column';
            icon.style.alignItems = 'center';
            icon.style.color = 'white';
            icon.style.textShadow = '1px 1px 2px black';
            icon.style.cursor = 'pointer';

            // The 32x32 Green Square Placeholder
            icon.innerHTML = `
                <div style="width: 32px; height: 32px; background-color: #00ff00; border: 1px solid #005500; border-radius: 3px; margin-bottom: 5px;"></div>
                <span style="font-size: 11px; text-align: center;">${item.title}</span>
            `;

            // Double click logic
            icon.ondblclick = () => {
                if (item.isApp) this.launchApp(item.id);
                else alert(`Built-in folder '${item.title}' coming soon!`);
            };

            desktopEl.appendChild(icon);

            // Arrange icons in a grid
            topPos += 70;
            if (topPos > 400) { 
                topPos = 10;
                leftPos += 70;
            }
        });
    },

    launchApp: function(appId) {
        if (openProcesses[appId]) {
            InteractionEngine.bringToFront(`window-${appId}`);
            return;
        }

        const app = AppRegistry[appId];
        if (!app) return;

        openProcesses[appId] = true;
        const winId = `window-${appId}`;

        // Create Window HTML
        const win = document.createElement('div');
        win.className = 'window';
        win.id = winId;
        win.style.position = 'absolute';
        win.style.width = app.width || '400px';
        win.style.height = app.height || '300px';
        win.style.top = '50px';
        win.style.left = '50px';
        win.style.zIndex = ++globalZIndex;

        win.innerHTML = `
            <div class="title-bar" onmousedown="InteractionEngine.startDrag(event, '${winId}')">
                <span>${app.title}</span>
                <button onclick="SystemEngine.closeApp('${appId}')">X</button>
            </div>
            <div class="window-content">${app.html}</div>
        `;

        document.getElementById('window-layer').appendChild(win);
        this.updateTaskbar();
    },

    closeApp: function(appId) {
        const win = document.getElementById(`window-${appId}`);
        if (win) {
            win.remove();
            delete openProcesses[appId];
            this.updateTaskbar();
        }
    },

    updateTaskbar: function() {
        const tray = document.getElementById('taskbar-tray');
        if (!tray) return;
        tray.innerHTML = '';
        
        Object.keys(openProcesses).forEach(appId => {
            const btn = document.createElement('button');
            btn.innerText = AppRegistry[appId].title;
            btn.style.marginLeft = '5px';
            btn.style.height = '100%';
            btn.onclick = () => InteractionEngine.bringToFront(`window-${appId}`);
            tray.appendChild(btn);
        });
    },

    toggleStartMenu: function() {
        let sm = document.getElementById('start-menu');
        
        // Build the Start Menu if it doesn't exist yet
        if (!sm) {
            sm = document.createElement('div');
            sm.id = 'start-menu';
            // Inline styles for the demo to match your screenshot layout
            sm.style.position = 'absolute';
            sm.style.bottom = '30px'; 
            sm.style.left = '0';
            sm.style.width = '300px';
            sm.style.height = '400px';
            sm.style.backgroundColor = 'white';
            sm.style.border = '2px solid var(--xp-blue, #003399)';
            sm.style.borderBottom = 'none';
            sm.style.borderTopLeftRadius = '5px';
            sm.style.borderTopRightRadius = '5px';
            sm.style.display = 'flex';
            sm.style.flexDirection = 'column';
            sm.style.zIndex = 9999;

            sm.innerHTML = `
                <div style="background: linear-gradient(to right, #003399, #245edb); color: white; padding: 10px; font-weight: bold; font-size: 16px; display: flex; align-items: center;">
                    <div style="width: 32px; height: 32px; background: orange; border-radius: 3px; margin-right: 10px;"></div>
                    ${FileSystem.user}
                </div>
                <div style="flex-grow: 1; padding: 10px; display: flex;">
                    <div style="width: 50%; border-right: 1px solid #ccc; padding-right: 5px;">
                        <p style="color: gray; font-size: 12px;">Pinned Apps Area</p>
                    </div>
                    <div style="width: 50%; background: #d3e5fa; padding-left: 10px;">
                        <p style="color: #003399; font-weight: bold; font-size: 12px; cursor: pointer;">My Documents</p>
                        <p style="color: #003399; font-weight: bold; font-size: 12px; cursor: pointer;">My Computer</p>
                    </div>
                </div>
            `;
            document.body.appendChild(sm);
        } else {
            // Toggle visibility
            sm.style.display = sm.style.display === 'none' ? 'flex' : 'none';
        }
    }
};

// Initialize the OS after all scripts load
window.onload = () => {
    SystemEngine.init();
};
