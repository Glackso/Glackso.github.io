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

// ================= BOOT SEQUENCE =================
const bootScreen = document.getElementById('bootScreen');

// Make sure you download an MP3 and save it as 'startup.mp3' in your audio folder!
const startupSound = new Audio('audio/startup.mp3'); 

bootScreen.addEventListener('click', () => {
    // Play the sound
    startupSound.play().catch(error => {
        console.log("Audio failed to play, but booting anyway.", error);
    });
    
    // Hide the boot screen
    bootScreen.style.display = 'none';
});

// ================= START MENU LOGIC =================
const startBtn = document.querySelector('.start-button');
const startMenu = document.getElementById('startMenu');

// Toggle the start menu when clicking the start button
startBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the document click listener from firing immediately
    if (startMenu.style.display === 'flex') {
        startMenu.style.display = 'none';
    } else {
        startMenu.style.display = 'flex';
        // Bring the start menu above any open windows
        highestZIndex++;
        startMenu.style.zIndex = highestZIndex;
    }
});

// Close the start menu if you click anywhere else on the desktop or windows
document.addEventListener('click', (e) => {
    // If the menu is open, and the click was NOT inside the start menu
    if (startMenu.style.display === 'flex' && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
    }
});
