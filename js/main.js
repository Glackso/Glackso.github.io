const GRID_SIZE = 80;

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    // Initialize Snap-to-Grid for Desktop Icons
    interact('.shortcut').draggable({
        listeners: {
            end(event) {
                const target = event.target;
                // Calculate nearest grid slot
                const x = Math.round(event.clientOffset.x / GRID_SIZE) * GRID_SIZE;
                const y = Math.round(event.clientOffset.y / GRID_SIZE) * GRID_SIZE;
                
                target.style.left = `${x}px`;
                target.style.top = `${y}px`;
            }
        }
    });

    // Clicks
    document.body.addEventListener('dblclick', e => {
        const shortcut = e.target.closest('.shortcut');
        if (shortcut) openApp(shortcut.dataset.app);
    });

    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.addEventListener('click', () => openApp(item.dataset.app));
    });
});

function openApp(id) {
    if (document.getElementById(`win-${id}`)) return;
    
    const appData = AppRegistry[id];
    const win = document.createElement('div');
    win.id = `win-${id}`;
    win.className = 'window';
    win.style.width = "400px"; // Set standard size
    win.style.height = "300px";

    win.innerHTML = `
        <div class="window-header">
            <div class="header-left">
                <img src="${appData.icon}">
                <span>${appData.title}</span>
            </div>
            <div class="controls">
                <button class="win-btn min">0</button>
                <button class="win-btn close">r</button> 
            </div>
        </div>
        <div class="window-body">${appData.getContent()}</div>
    `;

    document.getElementById('window-layer').appendChild(win);

    // Re-usable Window Dragging
    interact(`#win-${id}`).draggable({
        allowFrom: '.window-header',
        onmove: (event) => {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    });

    win.querySelector('.close').onclick = () => win.remove();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
