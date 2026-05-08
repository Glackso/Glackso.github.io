const AppDefinitions = {
    notepad: {
        title: "Notepad",
        icon: "assets/icons/16/notepad.png",
        content: '<textarea class="xp-editor"></textarea>'
    },
    cmd: {
        title: "Command Prompt",
        icon: "assets/icons/16/cmd.png",
        content: '<div class="terminal">Microsoft Windows XP [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br><br>C:\\>_</div>'
    }
};

function openApp(appId) {
    const app = AppDefinitions[appId];
    const win = document.createElement('div');
    win.className = 'window xp-window'; // Assuming xp.css classes
    win.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">${app.title}</div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="this.closest('.window').remove()"></button>
            </div>
        </div>
        <div class="window-body">${app.content}</div>
    `;
    document.getElementById('desktop').appendChild(win);
    
    // Initialize interact.js on the new window
    makeWindowInteractable(win);
}
