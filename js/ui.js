/**
 * UI: Manages the Start Menu, Taskbar, and Z-Index.
 */
const UI = {
    currentZIndex: 100,

    getNextZIndex() {
        this.currentZIndex++;
        return this.currentZIndex;
    },

    initStartMenu() {
        const startBtn = document.getElementById('start-btn');
        const startMenu = document.getElementById('start-menu');

        if (startBtn && startMenu) {
            startBtn.onclick = (e) => {
                e.stopPropagation();
                startMenu.classList.toggle('hidden');
            };

            // Close menu when clicking desktop
            document.addEventListener('click', () => {
                startMenu.classList.add('hidden');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => UI.initStartMenu());
