const notepadApp = {
    currentFile: null,

    openEmpty: function() {
        this.currentFile = null;
        document.querySelector('#notepad textarea').value = "";
        document.getElementById('notepad-title').innerText = "Untitled - Notepad";
        openApp('notepad', 'Untitled - Notepad', 'assets/icons/32/notepad.png');
    },

    openExisting: function(file) {
        this.currentFile = file;
        document.querySelector('#notepad textarea').value = file.content;
        document.getElementById('notepad-title').innerText = `${file.name} - Notepad`;
        openApp('notepad', `${file.name} - Notepad`, 'assets/icons/32/notepad.png');
    },

    save: function() {
        const content = document.querySelector('#notepad textarea').value;
        document.getElementById('file-menu').style.display = 'none'; // Hide menu

        if (this.currentFile) {
            this.currentFile.content = content;
            alert(`Saved changes to ${this.currentFile.name}!`);
        } else {
            let fileName = prompt("Save As:", "New Note.txt");
            if (!fileName) return;
            if (!fileName.endsWith('.txt')) fileName += '.txt';
            
            this.currentFile = { name: fileName, type: "file", content: content };
            
            // Save to filesystem
            driveC["C:\\My Notes"].push(this.currentFile);
            document.getElementById('notepad-title').innerText = `${fileName} - Notepad`;
            
            // Refresh folder if open
            if (document.getElementById('current-path').innerText === "C:\\My Notes") {
                renderFiles("C:\\My Notes");
            }
            alert(`Saved "${fileName}" to C:\\My Notes!`);
        }
    }
};
