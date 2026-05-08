const AppRegistry = {
    my_computer: {
        title: "My Computer",
        icon: "assets/icons/32/computer.png",
        getContent: () => `
            <div class="status-bar">
                <p class="status-bar-field">3 objects</p>
            </div>
            <div class="folder-view">
                <div class="item" onclick="openFolder('C:')">Local Disk (C:)</div>
                <div class="item" onclick="openFolder('D:')">CD Drive (D:)</div>
            </div>
        `
    },
    notepad: {
        title: "Notepad",
        icon: "assets/icons/32/notepad.png",
        getContent: () => `<textarea style="width:100%; height:200px;"></textarea>`
    }
};
