// Register "My Computer"
AppManager.registerApp('myComputer', {
    name: 'My Computer',
    // Point these to your actual icon files in the assets folder
    icon16: 'assets/icons/16/computer.png', 
    icon32: 'assets/icons/32/computer.png',
    
    // The HTML that goes inside the window
    contentHTML: `
        <div style="padding: 15px; height: 100%; background: #fff;">
            <h3>Hard Disk Drives</h3>
            <hr>
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
                <img src="assets/icons/32/drive.png" onerror="this.src='https://via.placeholder.com/32'" alt="Drive">
                <div>
                    <strong>Local Disk (C:)</strong><br>
                    <small>0 bytes free of 0 bytes</small>
                </div>
            </div>
        </div>
    `
});

// To add another app later, just do:
// AppManager.registerApp('minesweeper', { ... });
