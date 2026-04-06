const win = document.getElementById("myComputer");
const header = document.getElementById("windowHeader");

function openWindow() { 
    win.style.display = "block"; 
}

function closeWindow() { 
    win.style.display = "none"; 
}

// Window Dragging Logic
let isDragging = false;
let offsetX, offsetY;

header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        win.style.left = (e.clientX - offsetX) + 'px';
        win.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
