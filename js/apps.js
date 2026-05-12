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
            console.log("Saving to driveC:", text);
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
            for (let i = 0; i < 81; i++) {
                const tile = document.createElement('div');
                tile.className = 'ms-tile';
                tile.onmousedown = (e) => {
                    if (e.button === 0) tile.classList.add('revealed');
                };
                grid.appendChild(tile);
            }
        }
    },

    'computer': {
        title: "My Computer",
        icon: "assets/icons/16/computer.png",
        generateHTML: () => `
            <div class="explorer-container" style="background:white; height:100%;">
                <div id="explorer-content" style="display:flex; gap:20px; padding:10px; flex-wrap:wrap;"></div>
            </div>
        `,
        initGame: function() {
            const content = document.getElementById('explorer-content');
            if (content && typeof driveC !== 'undefined') {
                driveC["C:\\"].forEach(item => {
                    content.innerHTML += `
                        <div class="shortcut-dark" style="text-align:center; width:60px;">
                            <img src="assets/icons/32/${item.type}.png" width="32">
                            <p style="font-size:11px;">${item.name}</p>
                        </div>`;
                });
            }
        }
    },

    'cmd': {
        title: "Command Prompt",
        icon: "assets/icons/16/cmd.png",
        generateHTML: () => `
            <div class="cmd-body" style="background:black; color:white; font-family:monospace; height:100%; padding:5px;">
                <div id="cmd-history">Microsoft Windows XP [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br><br></div>
                <div class="cmd-input-line" style="display:flex;">
                    <span>C:\\></span>
                    <input type="text" id="cmd-input" autofocus style="background:none; border:none; color:white; outline:none; flex:1;" 
                           onkeydown="if(event.key==='Enter') AppRegistry.cmd.execute(this.value)">
                </div>
            </div>
        `,
        execute: function(input) {
            const history = document.getElementById('cmd-history');
            let response = "";
            const cmd = input.toLowerCase().trim();
            if (cmd === "cls") { history.innerHTML = ""; }
            else if (cmd === "ver") { response = "Windows XP Simulator [Version 1.0]"; }
            else { response = `'${cmd}' is not recognized as an internal or external command.`; }
            history.innerHTML += `C:\\> ${input}<br>${response}<br><br>`;
            document.getElementById('cmd-input').value = "";
        }
    },

    'ie': {
        title: "Internet Explorer",
        icon: "assets/icons/16/ie.png",
        generateHTML: () => `
            <div class="ie-container" style="display:flex; flex-direction:column; height:100%;">
                <div class="ie-address-bar" style="background:#ece9d8; padding:3px; display:flex; gap:5px; border-bottom:1px solid #999;">
                    <span>Address</span>
                    <input type="text" value="http://www.google.com" style="flex:1; border:1px solid #7f9db9;">
                </div>
                <iframe src="https://www.google.com/search?igu=1" style="flex:1; border:none; background:white;"></iframe>
            </div>
        `
    }
};
