const GRID_SIZE = 80;

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    // Desktop Icon Dragging with Snap-to-Grid
    interact('.shortcut').draggable({
        listeners: {
            end(event) {
                const target = event.target;
                const x = Math.round(event.clientOffset.x / GRID_SIZE) * GRID_SIZE;
                const y = Math.round(event.clientOffset.y / GRID_SIZE) * GRID_SIZE;
                target.style.left = `${x}px`;
                target.style.top = `${y}px`;
            }
        }
    });

    // Event Delegation for Opening Apps
    document.addEventListener('dblclick', e => {
        const shortcut = e.target.closest('.shortcut');
        if (shortcut) openApp(shortcut.dataset.app);
    });

    // Pinned App Clicks
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.addEventListener('click', () => openApp(item.dataset.app));
    });
});

function openApp(id) {
    if (document.getElementById(`win-${id}`)) return;
    
    const appData = AppRegistry[id];
    if (!appData) return;

    const win = document.createElement('div');
    win.id = `win-${id}`;
    win.className = 'window'; // Standard XP.css class
    win.style.position = 'absolute';
    win.style.width = appData.width || "300px";
    win.style.zIndex = "100";

    // Salvaged UI structure from your React snippet
    win.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">
                ${appData.title}
            </div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" class="close-btn"></button>
            </div>
        </div>
        <div class="window-body">
            ${appData.getContent()}
        </div>
    `;

    document.getElementById('window-layer').appendChild(win);

    // Make Draggable
    interact(`#win-${id}`).draggable({
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

    win.querySelector('.close-btn').onclick = () => win.remove();
}

function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    if(clockEl) clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
