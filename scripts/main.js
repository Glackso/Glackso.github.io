// ================= CORE VARIABLES & DATA =================
let highestZIndex = 10;

// App Data (Tells the taskbar what icon and name to use)
const appData = {
    'myComputer': { title: 'My Computer', icon: 'images/icons/16x16/computer.png' },
    'notepad': { title: 'Untitled - Notepad', icon: 'images/icons/16x16/notepad.png' }
};

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
    
    // Check if the taskbar button already exists
    let tbBtn = document.getElementById('tb-' + appId);
    
    // If it doesn't exist, create it!
    if (!tbBtn) {
        tbBtn = document.createElement('div');
        tbBtn.className = 'taskbar-btn';
        tbBtn.id = 'tb-' + appId;
        tbBtn.innerHTML = `<img src="${appData[appId].icon}" onerror="this.src='images/icons/16x16/computer.png'"> <span>${appData[appId].title}</span>`;
        
        // Add click logic to the taskbar button
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

// ================= REAL-TIME CLOCK =================
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert military time to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Add a leading zero to minutes if they are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = hours + ':' + minutes + ' ' + ampm;
    document.getElementById('clock').innerText = timeString;
}

// Run the clock immediately, then update it every 1 second
updateClock();
setInterval(updateClock, 1000);

// (Keep your existing dragging and start menu logic down here...)

// Universal Window Dragging Engine
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

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
