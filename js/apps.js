const AppRegistry = {
    'computer': {
        title: "My Computer",
        icon: "assets/icons/16/computer.png",
        generateHTML: () => `
            <div class="explorer-wrapper" style="display: flex; flex-direction: column; height: 100%; background: white; font-family: 'Tahoma', sans-serif;">
                <div class="nav-bar" style="display: flex; align-items: center; padding: 4px; background: #ece9d8; border-bottom: 1px solid #999; gap: 10px; user-select: none;">
                    <button onclick="AppRegistry.computer.goBack()" style="display: flex; align-items: center; gap: 3px; padding: 2px 5px; font-size:11px; cursor: pointer;">
                        <img src="assets/icons/16/back.png" width="16"> Back
                    </button>
                    <div style="border-left: 1px solid #999; height: 20px;"></div>
                    <span style="font-size: 11px;">Address:</span>
                    <div id="current-path" style="flex: 1; background: white; border: 1px solid #7f9db9; padding: 2px 5px; font-size: 11px; overflow: hidden;">C:\\</div>
                </div>
                
                <div style="display: flex; flex: 1; overflow: hidden;">
                    <div class="explorer-sidebar" style="width: 180px; background: linear-gradient(180deg, #748aff 0%, #4059de 100%); padding: 10px; color: white;">
                        <div style="background: white; border-radius: 4px 4px 0 0; padding: 3px 8px; font-weight: bold; color: #215dc6; font-size: 11px;">System Tasks</div>
                        <div style="background: rgba(255,255,255,0.3); padding: 10px; font-size: 11px; margin-bottom: 15px;">
                            <p style="margin: 0; cursor: pointer; text-decoration: underline;">View system info</p>
                            <p style="margin: 5px 0 0 0; cursor: pointer; text-decoration: underline;">Add/Remove programs</p>
                        </div>
                    </div>

                    <div id="file-viewer" style="flex: 1; padding: 15px; display: flex; gap: 20px; flex-wrap: wrap; align-content: flex-start; overflow-y: auto; background: white;"></div>
                </div>
            </div>
        `,
        
        renderFiles: function(path) {
            const viewer = document.getElementById('file-viewer');
            const pathDisplay = document.getElementById('current-path');
            if (!viewer || !pathDisplay) return;

            pathDisplay.innerText = path;
            viewer.innerHTML = '';

            const items = driveC[path] || [];

            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'file-item';
                
                // Determine Icon Logic
                let iconSrc = `assets/icons/32/folder.png`; // Default
                if (item.type === 'file') {
                    // Fix: if it's a .txt file, use notepad icon, else generic file
                    iconSrc = item.name.toLowerCase().endsWith('.txt') 
                        ? `assets/icons/32/notepad.png` 
                        : `assets/icons/32/file.png`;
                } else if (item.type === 'drive') {
                    iconSrc = `assets/icons/32/drive.png`;
                }

                div.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; width: 80px; text-align: center; cursor: pointer; padding: 5px;" class="file-hover-effect">
                        <img src="${iconSrc}" style="width: 32px; height: 32px; margin-bottom: 4px;" onerror="this.src='assets/icons/32/notepad.png'">
                        <span style="font-size: 11px; color: black; word-wrap: break-word; max-width: 75px;">${item.name}</span>
                    </div>
                `;

                div.ondblclick = (e) => {
                    e.stopPropagation();
                    if (item.type === 'folder') {
                        // Double backslash logic for the virtual drive paths
                        const newPath = path.endsWith('\\') ? `${path}${item.name}` : `${path}\\\\${item.name}`;
                        this.renderFiles(newPath);
                    } else {
                        AppManager.open('notepad', { content: item.content, title: item.name });
                    }
                };

                viewer.appendChild(div);
            });
        },

        goBack: function() {
            this.renderFiles("C:\\");
        },

        init: function() {
            this.renderFiles("C:\\");
        }
    },

    'notepad': {
        title: "Notepad",
        icon: "assets/icons/16/notepad.png",
        generateHTML: (params = {}) => `
            <textarea id="notepad-text" style="width:100%; height:100%; min-height: 250px; border:none; outline:none; font-family: 'Courier New', monospace; resize:none; padding:10px; box-sizing: border-box;" 
            onmousedown="event.stopPropagation()">${params.content || ''}</textarea>
        `
    }
};
