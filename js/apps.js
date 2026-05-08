const AppRegistry = {
    computer: {
        title: "My Computer",
        icon: "assets/icons/16/computer.png",
        getContent: () => {
            return `
                <div class="folder-view">
                    <div class="drive-item"><img src="assets/icons/32/computer.png"> Local Disk (C:)</div>
                    <div class="drive-item"><img src="assets/icons/32/folder.png"> My Documents</div>
                </div>`;
        }
    },
    notepad: {
        title: "Notepad",
        icon: "assets/icons/16/notepad.png",
        getContent: () => `<textarea class="notepad-text"></textarea>`
    },
    cmd: {
        title: "Command Prompt",
        icon: "assets/icons/16/cmd.png",
        getContent: () => `<div class="cmd-box">Microsoft Windows XP [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br><br>C:\\> _</div>`
    }
};
