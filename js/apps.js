/**
 * Apps: Definitions for every program in the OS.
 */

// 1. My Computer
AppManager.registerApp('myComputer', {
    title: 'My Computer',
    icon: 'assets/icons/32/computer.png',
    width: '450px',
    content: `
        <div class="my-computer-content">
            <p>Select an item to view its description.</p>
            <hr>
            <div style="display: flex; gap: 20px; padding: 10px;">
                <div class="drive-icon">
                    <img src="assets/icons/32/drive.png" width="32">
                    <p>Local Disk (C:)</p>
                </div>
                <div class="drive-icon">
                    <img src="assets/icons/32/cd.png" width="32">
                    <p>CD Drive (D:)</p>
                </div>
            </div>
        </div>
        <div class="status-bar">
            <p class="status-bar-field">2 objects</p>
            <p class="status-bar-field">My Computer</p>
        </div>
    `
});

// 2. Add more apps here easily
AppManager.registerApp('notepad', {
    title: 'Notepad',
    icon: 'assets/icons/32/notepad.png',
    width: '300px',
    content: `<textarea style="width:100%; height:150px; resize:none;"></textarea>`
});
