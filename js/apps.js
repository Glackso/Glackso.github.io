const notepadApp = {
    currentFile: null,

    openEmpty: function() {
        this.currentFile = null;
        document.querySelector('#notepad textarea').value = "";
        document.getElementById('notepad-title').innerText = "Untitled - Notepad";
        // Passing the 16x16 icon to the taskbar logic
        openApp('notepad', 'Untitled - Notepad', 'assets/icons/16/notepad.png');
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

const ieApp = {
    pages: {
        "google.com": `
            <center style="margin-top:50px;">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png" width="160"><br><br>
                <input type="text" style="width: 300px; border: 1px solid #7f9db9;"><br><br>
                <button>Google Search</button> <button>I'm Feeling Lucky</button>
            </center>`,
        "windows.com": `
            <div style="font-family: 'Segoe UI', Tahoma; padding: 20px;">
                <h1 style="color: #003399;">Discover Windows XP</h1>
                <p>The new version of Windows is here, and it's better than ever.</p>
                <img src="assets/wallpapers/bliss.jpg" width="100%" style="border: 1px solid #ccc;">
            </div>`,
        "error": `
            <div style="padding: 40px; font-family: Tahoma;">
                <h1 style="font-size: 1.5em;">The page cannot be displayed</h1>
                <p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties.</p>
                <hr>
                <p>Please try the following:</p>
                <ul>
                    <li>Click the Refresh button, or try again later.</li>
                    <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
                </ul>
            </div>`
    },

    navigate: function() {
        const address = document.getElementById('ie-address').value.toLowerCase();
        const content = document.getElementById('ie-content');
        
        // Basic "Routing"
        if (address.includes("google")) {
            content.innerHTML = this.pages["google.com"];
        } else if (address.includes("windows")) {
            content.innerHTML = this.pages["windows.com"];
        } else {
            content.innerHTML = this.pages["error"];
        }
    }
};
