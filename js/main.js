let openWindows = [];

function createWindow(appKey) {
    const app = AppRegistry[appKey];
    const winId = `win-${Date.now()}`;
    
    const winHtml = `
        <div id="${winId}" class="window" style="width: 400px; position: absolute; top: 100px; left: 100px;">
            <div class="title-bar">
                <div class="title-bar-text">${app.title}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="minimizeWindow('${winId}')"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onclick="closeWindow('${winId}')"></button>
                </div>
            </div>
            <div class="window-body">
                ${app.getContent()}
            </div>
        </div>
    `;

    document.getElementById('window-container').insertAdjacentHTML('beforeend', winHtml);
    makeDraggable(winId);
    addToTaskbar(winId, app.title);
}

function makeDraggable(id) {
    interact(`#${id}`).draggable({
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

function closeWindow(id) {
    document.getElementById(id).remove();
    document.querySelector(`[data-win-id="${id}"]`).remove();
}

function minimizeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

function restoreWindow(id) {
    document.getElementById(id).style.display = 'block';
}
