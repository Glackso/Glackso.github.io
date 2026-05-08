document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    // Desktop Shortcut Clicks
    document.querySelectorAll('.shortcut').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appId = icon.getAttribute('data-app');
            openApp(appId);
        });
    });
});

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clock').innerText = timeStr;
}

function openApp(id) {
    // Basic check to see if app is already open
    if (document.getElementById(`win-${id}`)) return;

    const win = document.createElement('div');
    win.id = `win-${id}`;
    win.className = 'window xp-window'; // Assuming xp.css uses these classes
    
    win.innerHTML = `
        <div class="window-header">
            <img src="assets/icons/16/${id}.png">
            <span class="title">${id === 'computer' ? 'My Computer' : id}</span>
            <div class="controls">
                <button class="min">_</button>
                <button class="close">X</button>
            </div>
        </div>
        <div class="window-body">
            ${getAppContent(id)}
        </div>
    `;

    document.getElementById('window-layer').appendChild(win);

    // Initialize dragging via interact.js
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
