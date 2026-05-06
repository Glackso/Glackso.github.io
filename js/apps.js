// Notepad Application Logic
const notepadApp = {
    currentFile: null,

    openEmpty: function() {
        this.currentFile = null;
        document.querySelector('#notepad textarea').value = "";
        document.getElementById('notepad-title').innerText = "Untitled - Notepad";
        
        // Uses the main.js openApp function to handle taskbar integration
        openApp('notepad', 'Untitled - Notepad', 'assets/icons/32/notepad.png');
    },

    save: function() {
        const content = document.querySelector('#notepad textarea').value;
        
        // Hide the dropdown menu after clicking save
        document.getElementById('file-menu').style.display = 'none';

        if (this.currentFile) {
            alert(`File "${this.currentFile.name}" overwritten successfully!`);
            // In a real version, you'd update your fileSystem object here
        } else {
            let fileName = prompt("Save As:", "New Note.txt");
            if (!fileName) return;

            if (!fileName.endsWith('.txt')) fileName += '.txt';
            
            this.currentFile = { name: fileName, type: "file", content: content };
            
            // Update UI
            document.getElementById('notepad-title').innerText = `${fileName} - Notepad`;
            
            // Update Taskbar button text
            const taskbarBtn = document.getElementById('taskbar-btn-notepad');
            if (taskbarBtn) {
                taskbarBtn.innerHTML = `<img src="assets/icons/32/notepad.png" style="width: 14px; margin-right: 5px;"> ${fileName} - Notepad`;
            }
            
            alert(`Saved "${fileName}" to virtual storage!`);
        }
    }
};

// Map the HTML shortcut to our new apps.js logic
function openEmptyNotepad() {
    notepadApp.openEmpty();
}
