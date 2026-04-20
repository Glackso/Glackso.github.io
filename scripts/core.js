const AppRegistry = {}; 
let globalZIndex = 10;

const SystemEngine = {
    registerApp: function(appId, appConfig) {
        AppRegistry[appId] = appConfig;
        console.log(`[System] ${appConfig.title} installed.`);
    },

    launchApp: function(appId) {
        const app = AppRegistry[appId];
        if (!app) return alert('App not found!');

        const winId = `window-${appId}`;
        
        // Bring to front if already open
        if (document.getElementById(winId)) {
            document.getElementById(winId).style.zIndex = ++globalZIndex;
            return;
        }

        // Build Window
        const win = document.createElement('div');
        win.className = 'window';
        win.id = winId;
        win.style.width = app.width || '400px';
        win.style.height = app.height || '300px';
        win.style.top = '50px';
        win.style.left = '50px';
        win.style.zIndex = ++globalZIndex;

        win.innerHTML = `
            <div class="title-bar" onmousedown="InteractionEngine.startDrag(event, '${winId}')">
                <span>${app.title}</span>
                <button onclick="SystemEngine.closeApp('${winId}')">X</button>
            </div>
            <div class="window-content">${app.html}</div>
        `;

        document.getElementById('window-layer').appendChild(win);
    },

    closeApp: function(winId) {
        const win = document.getElementById(winId);
        if (win) win.remove();
    }
};
