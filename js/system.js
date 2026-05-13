/**
 * System: The bootstrapper.
 */
const System = {
    boot() {
        console.log("Windows XP is starting...");
        
        // Start the UI Clock
        this.startClock();

        // Play Startup Sound
        const audio = new Audio('assets/sounds/startup.wav');
        audio.play().catch(() => console.log("Sound blocked by browser."));

        // Add any 'on-boot' logic here (e.g., auto-opening a welcome window)
    },

    startClock() {
        const update = () => {
            const clockEl = document.getElementById('clock');
            if (clockEl) {
                const now = new Date();
                clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        };
        setInterval(update, 1000);
        update();
    }
};

// Initialize system on load
document.addEventListener('DOMContentLoaded', () => System.boot());
