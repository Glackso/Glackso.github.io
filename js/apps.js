// This holds the definitions. appManager.js will read this to open windows.
const AppRegistry = {
    'notepad': {
        title: "Untitled - Notepad",
        icon: "assets/icons/16/notepad.png",
        generateHTML: (params) => `
            <div class="menu-bar">
                <div class="menu-item" onclick="toggleMenu('file-menu')">File
                    <ul id="file-menu" class="dropdown">
                        <li onclick="AppRegistry.notepad.onSave('${params.id}')">Save</li>
                        <li class="divider"></li>
                        <li onclick="AppManager.close('${params.id}')">Exit</li>
                    </ul>
                </div>
                <div class="menu-item">Edit</div>
            </div>
            <textarea id="notepad-text" spellcheck="false" onmousedown="event.stopPropagation()">${params.content || ''}</textarea>
        `,
        onSave: (id) => {
            const text = document.getElementById('notepad-text').value;
            console.log("Saving content for:", id, text);
            SystemState.save();
        }
    },

    'minesweeper': {
        title: "Minesweeper",
        icon: "assets/icons/16/minesweeper.png",
        generateHTML: () => `
            <div class="minesweeper-container" onmousedown="event.stopPropagation()">
                <div class="ms-header">
                    <div id="mine-count" class="ms-counter">010</div>
                    <div class="ms-face" id="ms-face" onclick="AppRegistry.minesweeper.initGame()"></div>
                    <div id="timer" class="ms-counter">000</div>
                </div>
                <div id="ms-grid" class="ms-grid"></div>
            </div>
        `,
        initGame: function() {
            const grid = document.getElementById('ms-grid');
            if (!grid) return;
            grid.innerHTML = '';
            // Salvaged 9x9 grid logic
            for (let i = 0; i < 81; i++) {
                const tile = document.createElement('div');
                tile.className = 'ms-tile';
                tile.onmousedown = (e) => {
                    if (e.button === 0) tile.classList.add('revealed');
                };
                grid.appendChild(tile);
            }
            console.log("Minesweeper Grid Generated");
        }
    },

    'computer': {
        title: "My Computer",
        icon: "assets/icons/16/computer.png",
        generateHTML: () => `
            <div class="explorer-container" style="background:white; height:100%;">
                <div id="explorer-content" style="display:flex; gap:20px; padding:10px;"></div>
            </div>
        `,
        initGame: function() {
            const content = document.getElementById('explorer-content');
            if (content && typeof driveC !== 'undefined') {
                driveC["C:\\"].forEach(item => {
                    content.innerHTML += `<div class="shortcut-dark"><img src="assets/icons/32/${item.type}.png"><p>${item.name}</p></div>`;
                });
            }
        }
    }
};
