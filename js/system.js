document.addEventListener('DOMContentLoaded', () => {
    
    // Play startup sound (Browsers require user interaction first, so this might need to trigger on first click instead)
    const startupSound = new Audio('assets/sounds/startup.wav');
    // startupSound.play().catch(e => console.log("Waiting for user interaction to play sound"));

    // Taskbar Clock Logic
    function updateClock() {
        const now = new Date();
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
});
