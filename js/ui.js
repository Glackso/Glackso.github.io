function renderShortcuts() {
    const grid = document.getElementById('icon-grid');
    grid.innerHTML = `
        <div class="shortcut" ondblclick="AppManager.open('computer')">
            <img src="assets/icons/32/computer.png">
            <p>My Computer</p>
        </div>
    `;
}

function toggleStartMenu() {
    const m = document.getElementById('start-menu');
    m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
