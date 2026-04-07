// ================= CORE VARIABLES & DATA =================
let highestZIndex = 10;
const desktop = document.querySelector('.desktop');

// App Data (Tells the taskbar what icon and name to use)
const appData = {
    'myComputer': { title: 'My Computer', icon: 'images/icons/16x16/computer.png' },
    'notepad': { title: 'Untitled - Notepad', icon: 'images/icons/16x16/notepad.png' }
    // Error dialogs don't need taskbar data
};

// Define Error Sound (make sure you added audio/error.mp3!)
const errorSound = new Audio('audio/error.mp3');

// ================= WINDOW MANAGEMENT =================
function bringToFront(element) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
}

// Open App (or restore from taskbar)
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = "flex";
    bringToFront(appWindow);
    
    // Check if the taskbar button already exists (only for standard apps)
    if (!appData[appId]) return; // Stop here for error dialogs

    let tbBtn = document.getElementById('tb-' + appId);
    
    if (!tbBtn) {
        tbBtn = document.createElement('div');
        tbBtn.className = 'taskbar-btn';
        tbBtn.id = 'tb-' + appId;
        tbBtn.innerHTML = `<img src="${appData[appId].icon}" onerror="this.src='images/icons/16x16/computer.png'"> <span>${appData[appId].title}</span>`;
        
        tbBtn.onclick = () => {
            if (appWindow.style.display === "none") {
                appWindow.style.display = "flex";
                bringToFront(appWindow);
            } else if (appWindow.style.zIndex == highestZIndex) {
                minimizeApp(appId);
            } else {
                bringToFront(appWindow);
            }
        };
        
        document.getElementById('taskbarApps').appendChild(tbBtn);
    }
}

// Special Function for the Corrupted App
function triggerError(appId) {
    // 1. Play the Critical Stop sound
    errorSound.play().catch(() => console.log("error.mp3 not found. Add it to audio/!"));
    
    // 2. Open the error dialog
    openApp(appId);
}

// Minimize App (Hides window, keeps taskbar button)
function minimizeApp(appId) {
    document.getElementById(appId).style.display = "none";
}

// Close App (Hides window, completely removes taskbar button)
function closeApp(appId) {
    document.getElementById(appId).style.display = "none";
    const tbBtn = document.getElementById('tb-' + appId);
    if (tbBtn) {
        tbBtn.remove(); // Deletes the button from the taskbar
    }
}

// Find all title bars and make them draggable (Universal)
document.querySelectorAll('.title-bar').forEach(header => {
    header.addEventListener('mousedown', (e) => {
        // Universal Dragging Logic
        let activeWindow = header.parentElement; 
        bringToFront(activeWindow);

        let offsetX = e.clientX - activeWindow.offsetLeft;
        let offsetY = e.clientY - activeWindow.offsetTop;

        function moveWindow(e) {
            activeWindow.style.left = (e.clientX - offsetX) + 'px';
            activeWindow.style.top = (e.clientY - offsetY) + 'px';
        }

        function stopMoving() {
            document.removeEventListener('mousemove', moveWindow);
            document.removeEventListener('mouseup', stopMoving);
        }

        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopMoving);
    });
});

// Click anywhere on a window to bring it to front
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});

// ================= REAL-TIME CLOCK =================
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('clock').innerText = hours + ':' + minutes + ' ' + ampm;
}
updateClock();
setInterval(updateClock, 1000);

// ================= START MENU LOGIC =================
const startBtn = document.querySelector('.start-button');
const startMenu = document.getElementById('startMenu');

startBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (startMenu.style.display === 'flex') {
        startMenu.style.display = 'none';
    } else {
        startMenu.style.display = 'flex';
        bringToFront(startMenu);
    }
});

document.addEventListener('click', (e) => {
    if (startMenu.style.display === 'flex' && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
    }
});

// ================= BOOT SEQUENCE =================
const bootScreen = document.getElementById('bootScreen');
const startupSound = new Audio('audio/startup.mp3'); 

bootScreen.addEventListener('click', () => {
    startupSound.play().catch(() => console.log("startup.mp3 not found"));
    bootScreen.style.display = 'none';
    openApp('myComputer');
    openApp('notepad');
});

// ================= DESKTOP SELECTION BOX LOGIC =================
const selectionBox = document.getElementById('selectionBox');
let isDrawing = false;
let startX, startY;

// Start drawing when clicking on the desktop wallpaper
desktop.addEventListener('mousedown', (e) => {
    // CRITICAL: Only trigger if clicking directly on the desktop wallpaper container,
    // not on a desktop icon within it!
    if (e.target !== desktop) return;

    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;

    // Reset the box position/size and show it
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
});

// Update the size while dragging
document.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    // Calculate current width/height from the start position
    let width = e.clientX - startX;
    let height = e.clientY - startY;

    // The math must handle dragging backwards (negative width/height)!
    selectionBox.style.width = Math.abs(width) + 'px';
    selectionBox.style.height = Math.abs(height) + 'px';

    // If dragging backwards, the top/left anchor point must move!
    selectionBox.style.left = (width < 0) ? e.clientX + 'px' : startX + 'px';
    selectionBox.style.top = (height < 0) ? e.clientY + 'px' : startY + 'px';
});

// Hide the box when the mouse button is released
document.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        selectionBox.style.display = 'none';
    }
});
