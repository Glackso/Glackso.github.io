// Window Management
function openApp(id) {
    const win = document.getElementById(id);
    win.style.display = 'block';
    if(id === 'my-computer') renderFiles("C:\\");
}

function closeApp(id) {
    document.getElementById(id).style.display = 'none';
}

// File Navigation
function renderFiles(path) {
    const viewer = document.getElementById('file-viewer');
    document.getElementById('current-path').innerText = path;
    viewer.innerHTML = '';

    const items = driveC[path] || ["(Empty)"];
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerText = "📁 " + item;
        li.style.cursor = "pointer";
        li.onclick = () => {
            const nextPath = path === "C:\\" ? path + item : path + "\\" + item;
            if (driveC[nextPath]) {
                currentHistory.push(nextPath);
                renderFiles(nextPath);
            }
        };
        viewer.appendChild(li);
    });
}

function goBack() {
    if (currentHistory.length > 1) {
        currentHistory.pop();
        renderFiles(currentHistory[currentHistory.length - 1]);
    }
}

// Interact.js Draggable Logic
interact('.draggable').draggable({
    allowFrom: '.title-bar',
    listeners: {
        move (event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});
