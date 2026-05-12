const AppRegistry = {
    'computer': {
        title: "My Computer",
        icon: "assets/icons/16/computer.png",
        generateHTML: () => `
            <div class="explorer-container">
                <div class="explorer-sidebar">
                    <div class="sidebar-header">System Tasks</div>
                    <div class="sidebar-content">
                        <p>View system info</p>
                        <p>Add/remove programs</p>
                    </div>
                </div>
                <div id="file-viewer" class="file-viewer"></div>
            </div>
        `,
        init: function() {
            const viewer = document.getElementById('file-viewer');
            const items = [
                { name: "Local Disk (C:)", type: "drive" },
                { name: "Control Panel", type: "system" }
            ];
            items.forEach(item => {
                viewer.innerHTML += `
                    <div class="file-item">
                        <img src="assets/icons/32/${item.type}.png">
                        <span>${item.name}</span>
                    </div>`;
            });
        }
    }
};
