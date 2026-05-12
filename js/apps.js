const AppRegistry = {
    'computer': {
        title: "My Computer",
        icon: "assets/icons/16/computer.png",
        generateHTML: () => `
            <div class="explorer-wrapper" style="display: flex; flex-direction: column; height: 100%; background: white;">
                <div class="nav-bar" style="display: flex; align-items: center; padding: 4px; background: #ece9d8; border-bottom: 1px solid #999; gap: 10px; user-select: none;">
                    <button onclick="AppRegistry.computer.goBack()" style="display: flex; align-items: center; gap: 3px; padding: 2px 5px; font-size:11px;">
                        <img src="assets/icons/16/back.png" width="16"> Back
                    </button>
                    <div style="border-left: 1px solid #999; height: 20px;"></div>
                    <span style="font-size: 11px;">Address:</span>
                    <div id="current-path" style="flex: 1; background: white; border: 1px solid #7f9db9; padding: 2px 5px; font-size: 11px; overflow: hidden; white-space: nowrap;">C:\\</div>
                </div>
                
                <div style="display: flex; flex: 1; overflow: hidden;">
                    <div class="explorer-sidebar" style="width: 150px; background: linear-gradient(180deg, #748aff 0%, #4059de 100%); padding: 10px; color: white;">
                        <div style="background: white; border-radius: 4px; padding: 3px 5px; font-weight: bold; color: #215dc6; font-size: 10px; margin-bottom:10px;">System Tasks</div>
                        <p style="font-size:10px; margin: 5px 0; cursor: pointer;">View system info</p>
                    </div>

                    <div id="file-viewer" style="flex: 1; padding: 15px; display: flex; gap: 15px; flex-wrap: wrap; align-content: flex-start; overflow-y: auto;"></div>
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
                div.style.cssText = "display: flex; flex-direction: column; align-items: center; width: 70px; text-align: center; cursor: pointer; padding: 5px; border: 1px solid transparent;";
                
                // Selection effect from style (1).css
                div.onmouseover = () => { div.style.background = '#316ac5'; div.style.color = 'white'; };
                div.onmouseout = () => { div.style.background = 'transparent'; div.style.color = 'black'; };

                div.ondblclick = (e) => {
                    e.stopPropagation();
                    if (item.type === 'folder') {
                        // Correct path building for nested folders
                        const newPath = path === "C:\\" ? `C:\\\\${item.name}` : `${path}\\\\${item.name}`;
                        this.renderFiles(newPath);
                    } else if (item.type === 'file') {
                        // Opens Notepad with the file content
                        AppManager.open('notepad', { content: item.content, title: item.name });
                    }
                };

                div.innerHTML = `
                    <img src="assets/icons/32/${item.type}.png" style="width: 32px; height: 32px; margin-bottom: 4px;" onerror="this.src='assets/icons/32/file.png'">
                    <span style="font-size: 10px; word-wrap: break-word;">${item.name}</span>
                `;
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
        title: "Untitled - Notepad",
        icon: "assets/icons/16/notepad.png",
        generateHTML: (params = {}) => `
            <textarea id="notepad-text" style="width:100%; height:200px; border:none; outline:none; font-family:monospace; resize:none; padding:5px;" 
            onmousedown="event.stopPropagation()">${params.content || ''}</textarea>
        `
    }
};
