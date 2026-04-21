// ================= INTERACTION ENGINE =================
const InteractionEngine = {
    activeWindow: null,
    offsetX: 0, offsetY: 0,

    startDrag: function(e, winId) {
        const win = document.getElementById(winId);
        if (!win) return;

        // Prevent dragging if the window is maximized!
        if (win.classList.contains('maximized')) return;

        this.activeWindow = win;
        this.bringToFront(winId);
        
        // Calculate click offset relative to the window
        this.offsetX = e.clientX - this.activeWindow.getBoundingClientRect().left;
        this.offsetY = e.clientY - this.activeWindow.getBoundingClientRect().top;
        
        document.addEventListener('mousemove', this.doDrag);
        document.addEventListener('mouseup', this.stopDrag);
    },

    doDrag: function(e) {
        if (!InteractionEngine.activeWindow) return;
        InteractionEngine.activeWindow.style.left = (e.clientX - InteractionEngine.offsetX) + 'px';
        InteractionEngine.activeWindow.style.top = (e.clientY - InteractionEngine.offsetY) + 'px';
    },

    stopDrag: function() {
        InteractionEngine.activeWindow = null;
        document.removeEventListener('mousemove', InteractionEngine.doDrag);
        document.removeEventListener('mouseup', InteractionEngine.stopDrag);
    },

    bringToFront: function(winId) {
        const win = document.getElementById(winId);
        if (win) {
            globalZIndex++;
            win.style.zIndex = globalZIndex;
        }
    }
};
