// Universal App Opener/Closer
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = "flex";
    bringToFront(appWindow);
}

function closeApp(appId) {
    document.getElementById(appId).style.display = "none";
}

// Universal Window Dragging Engine
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;
let highestZIndex = 10;

function bringToFront(element) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
}

// Find all title bars and make them draggable
document.querySelectorAll('.title-bar').forEach(header => {
    header.addEventListener('mousedown', (e) => {
        // The active window is the parent of the title bar
        activeWindow = header.parentElement; 
        
        // Bring clicked window to the front
        bringToFront(activeWindow);

        // Calculate where the mouse grabbed the window
        offsetX = e.clientX - activeWindow.offsetLeft;
        offsetY = e.clientY - activeWindow.offsetTop;
    });
});

document.addEventListener('mousemove', (e) => {
    if (activeWindow) {
        activeWindow.style.left = (e.clientX - offsetX) + 'px';
        activeWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    // Drop the window
    activeWindow = null; 
});

// Click anywhere on a window to bring it to front
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});
