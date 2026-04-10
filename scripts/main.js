// =========================================================================
// WINDOWS XP SIMULATOR - CORE ENGINE V2.0
// =========================================================================

// --- Variables & Elements ---
let highestZIndex = 10;
const desktop = document.getElementById('desktop');
const startMenu = document.getElementById('startMenu');
const startBtn = document.querySelector('.start-button');
const selectionBox = document.getElementById('selectionBox');

// --- Audio ---
// Ensure you have startup.mp3 and error.mp3 inside your audio/ folder!
const startupSound = new Audio('audio/startup.mp3');
const errorSound = new Audio('audio/error.mp3');

// --- Application Registry ---
// Defines taskbar titles and 16x16 taskbar icons for apps
const appData = {
    'myComputer': { title: 'My Computer', icon: 'images/icons/16x16/computer.png' },
    'notepad': { title: 'Untitled - Notepad', icon: 'images/icons/16x16/notepad.png' },
    'internetExplorer': { title: 'Internet Explorer', icon: 'images/icons/16x16/ie.png' },
    'paint': { title: 'untitled - Paint', icon: 'images/icons/16x16/paint.png' },
    'mediaPlayer': { title: 'Windows Media Player', icon: 'images/icons/16x16/wmp.png' }
    'calculator': { title: 'Calculator', icon: 'images/icons/16x16/calc.png' },
};

// ================= LOGIN & BOOT SEQUENCE =================

function login() {
    // Play the startup chime
    startupSound.play().catch(() => console.log("startup.mp3 not found. Add it to audio/!"));
    
    // Hide the welcome screen
    document.getElementById('loginScreen').style.display = 'none';
    
    // Optional: Boot up default apps immediately
    // openApp('myComputer'); 
}


// ================= WINDOW MANAGEMENT =================

// Brings a clicked window to the very front
function bringToFront(element) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
}

// Opens an application and creates a taskbar button
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    if (!appWindow) return; // Prevent crashes if app doesn't exist yet

    appWindow.style.display = "flex";
    bringToFront(appWindow);
    
    // If it's an error window or unregistered app, don't put it on the taskbar
    if (!appData[appId]) return; 

    // Check if taskbar button exists
    let tbBtn = document.getElementById('tb-' + appId);
    
    if (!tbBtn) {
        // Create new taskbar button
        tbBtn = document.createElement('div');
        tbBtn.className = 'taskbar-btn';
        tbBtn.id = 'tb-' + appId;
        tbBtn.innerHTML = `<img src="${appData[appId].icon}" onerror="this.src='images/icons/16x16/computer.png'"> <span>${appData[appId].title}</span>`;
        
        // Taskbar button click logic
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

// Minimizes to taskbar
function minimizeApp(appId) {
    document.getElementById(appId).style.display = "none";
}

// Closes completely and removes taskbar button
function closeApp(appId) {
    document.getElementById(appId).style.display = "none";
    const tbBtn = document.getElementById('tb-' + appId);
    if (tbBtn) tbBtn.remove(); 
}

// Corrupted App / Error Trigger
function triggerError(appId) {
    errorSound.play().catch(() => console.log("error.mp3 not found. Add it to audio/!"));
    openApp(appId);
}


// ================= DRAG & DROP ENGINE =================

// Universal Title Bar Dragging
document.querySelectorAll('.title-bar').forEach(header => {
    header.addEventListener('mousedown', (e) => {
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


// ================= START MENU LOGIC =================

startBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (startMenu.style.display === 'flex') {
        startMenu.style.display = 'none';
        startBtn.style.boxShadow = "inset 1px 1px 1px rgba(255,255,255,0.4), 2px 0 5px rgba(0,0,0,0.4)"; // Unpressed
    } else {
        startMenu.style.display = 'flex';
        bringToFront(startMenu);
        startBtn.style.boxShadow = "inset 2px 2px 5px rgba(0,0,0,0.5)"; // Pressed in
    }
});

// Close start menu if clicking anywhere outside of it
document.addEventListener('click', (e) => {
    if (startMenu.style.display === 'flex' && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
        startBtn.style.boxShadow = "inset 1px 1px 1px rgba(255,255,255,0.4), 2px 0 5px rgba(0,0,0,0.4)";
    }
});


// ================= DESKTOP SELECTION BOX =================

let isDrawing = false;
let startX, startY;

desktop.addEventListener('mousedown', (e) => {
    if (e.target !== desktop) return; // Only draw if clicking bare wallpaper
    
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
    
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
});

document.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    let width = e.clientX - startX;
    let height = e.clientY - startY;

    selectionBox.style.width = Math.abs(width) + 'px';
    selectionBox.style.height = Math.abs(height) + 'px';
    selectionBox.style.left = (width < 0) ? e.clientX + 'px' : startX + 'px';
    selectionBox.style.top = (height < 0) ? e.clientY + 'px' : startY + 'px';
});

document.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        selectionBox.style.display = 'none';
    }
});


// ================= WALLPAPER CHANGER =================

const wallpapers = [
    "url('images/backgrounds/bliss.png')",
    "url('images/backgrounds/bless.png')",
    "url('images/backgrounds/dark.png')",
    "#3a6ea5", // Classic Windows Solid Blue Background
    "#000000"  // Solid Black
];
let currentWallpaper = 0;

function changeWallpaper() {
    currentWallpaper++;
    if (currentWallpaper >= wallpapers.length) {
        currentWallpaper = 0; // Loop back to the beginning
    }
    
    // Apply the new background to the desktop
    if (wallpapers[currentWallpaper].startsWith('#')) {
        desktop.style.background = wallpapers[currentWallpaper];
    } else {
        desktop.style.background = `${wallpapers[currentWallpaper]} no-repeat center center fixed`;
        desktop.style.backgroundSize = "cover";
    }
}


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


// ================= APP SPECIFIC LOGIC =================

// Notepad Download Logic
function saveNotepadText() {
    const textArea = document.querySelector('#notepad textarea');
    const blob = new Blob([textArea.value], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'MyXP_Document.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
    window.URL.revokeObjectURL(anchor.href);
}

// ================= CALCULATOR LOGIC =================
let calcCurrent = '0';
let calcPrevious = '';
let calcOperator = null;
let shouldResetDisplay = false;

function updateCalcDisplay() {
    document.getElementById('calcDisplay').innerText = calcCurrent;
}

function calcInput(num) {
    if (calcCurrent === '0' || shouldResetDisplay) {
        calcCurrent = num;
        shouldResetDisplay = false;
    } else {
        calcCurrent += num;
    }
    updateCalcDisplay();
}

function calcOp(op) {
    if (calcOperator !== null) calcEquals();
    calcPrevious = calcCurrent;
    calcOperator = op;
    shouldResetDisplay = true;
}

function calcEquals() {
    if (calcOperator === null || shouldResetDisplay) return;
    let a = parseFloat(calcPrevious);
    let b = parseFloat(calcCurrent);
    let result = 0;
    
    switch(calcOperator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b !== 0 ? a / b : 'Error'; break;
    }
    
    calcCurrent = String(result);
    calcOperator = null;
    shouldResetDisplay = true;
    updateCalcDisplay();
}

function clearCalc() {
    calcCurrent = '0';
    calcPrevious = '';
    calcOperator = null;
    updateCalcDisplay();
}
