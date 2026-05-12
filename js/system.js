let highestZIndex = 100;

function focusWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-win'));
    win.classList.add('active-win');
}

function bootSystem() {
    renderShortcuts();
    setInterval(() => {
        const clock = document.getElementById('clock');
        if (clock) clock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

window.onload = bootSystem;
