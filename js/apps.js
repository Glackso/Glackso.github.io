// This holds the definitions. appManager.js will read this to open windows.
const AppRegistry = {
    'notepad': {
        title: "Untitled - Notepad",
        icon: "assets/icons/16/notepad.png",
        generateHTML: (params) => `
            <div class="menu-bar">
                <div class="menu-item">File</div>
                <div class="menu-item">Edit</div>
            </div>
            <textarea id="notepad-text" spellcheck="false">${params.content || ''}</textarea>
        `,
        onSave: (id) => {
            const text = document.getElementById('notepad-text').value;
            // Logic to save back to driveC would go here
            SystemState.save();
        }
    },

    'minesweeper': {
        title: "Minesweeper",
        icon: "assets/icons/16/minesweeper.png",
        generateHTML: () => `
            <div class="minesweeper-container">
                <div class="ms-header">
                    <div id="mine-count" class="ms-counter"></div>
                    <div class="ms-face" id="ms-face" onclick="AppRegistry.minesweeper.initGame()"></div>
                    <div id="timer" class="ms-counter"></div>
                </div>
                <div id="ms-grid" class="ms-grid"></div>
            </div>
        `,
        initGame: function() {
            // Salvage your 16x16 logic from main.js and place here
            console.log("Minesweeper initialized");
            this.updateCounter('mine-count', 10);
            this.updateCounter('timer', 0);
        },
        updateCounter: function(id, val) {
            const container = document.getElementById(id);
            if (!container) return;
            container.innerHTML = '';
            // Logic for 'none' vs '0' goes here
            let digits = val.toString().padStart(3, '0').split('');
            digits.forEach(d => {
                const div = document.createElement('div');
                div.className = 'digit-box';
                div.style.backgroundImage = `url('assets/minesweeper/number/${d}.png')`;
                container.appendChild(div);
            });
        }
    },

    'cmd': {
        title: "Command Prompt",
        icon: "assets/icons/16/cmd.png",
        generateHTML: () => `
            <div class="cmd-body">
                <div id="cmd-history">Microsoft Windows XP [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br><br></div>
                <div class="cmd-input-line">
                    <span>C:\\></span>
                    <input type="text" id="cmd-input" autofocus onkeydown="if(event.key==='Enter') AppRegistry.cmd.execute(this.value)">
                </div>
            </div>
        `,
        execute: function(input) {
            const history = document.getElementById('cmd-history');
            let response = "";
            const cmd = input.toLowerCase().trim();

            if (cmd === "cls") {
                history.innerHTML = "";
            } else if (cmd === "ver") {
                response = "Windows XP Simulator [Version 1.0]";
            } else {
                response = `'${cmd}' is not recognized as an internal or external command.`;
            }

            history.innerHTML += `C:\\> ${input}<br>${response}<br><br>`;
            document.getElementById('cmd-input').value = "";
        }
    }
};
