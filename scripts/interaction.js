const InteractionEngine = {
    activeWindow: null,
    offsetX: 0, offsetY: 0,

    startDrag: function(e, winId) {
        this.activeWindow = document.getElementById(winId);
        this.activeWindow.style.zIndex = ++globalZIndex; // Bring to front on click
        
        // Calculate where the user clicked relative to the window
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
    }
};
