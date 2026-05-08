document.addEventListener('DOMContentLoaded', () => {
    console.log("Windows XP initialized.");
    
    // Example: Update clock in taskbar
    setInterval(() => {
        const now = new Date();
        document.getElementById('system-tray').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);
});

function makeWindowInteractable(element) {
    // Basic interact.js implementation
    interact(element).draggable({
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
}
