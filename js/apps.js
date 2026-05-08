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
        "google.com": `<div style="text-align:center; padding-top:50px; font-family:arial;">
            <h1 style="font-size:60px;"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></h1>
            <input type="text" style="width:400px; padding:5px; border:1px solid #ccc;">
            <div style="margin-top:20px;"><button>Google Search</button> <button>I'm Feeling Lucky</button></div>
        </div>`,
        "spacejam.com": `<div style="background:black; color:white; text-align:center; height:100%;">
            <h2 style="color:yellow;">Space Jam (1996)</h2>
            <p>Welcome to the original website!</p>
        </div>`,
        "msn.com": `<div style="background:#003399; color:white; padding:10px;">
            <h3>MSN Messenger</h3>
            <p>Your friends are online!</p>
        </div>`
    },

    navigate: function() {
        const address = document.getElementById('ie-address').value.toLowerCase().replace('www.', '');
        const content = document.getElementById('ie-content');
        
        if (this.pages[address]) {
            content.innerHTML = this.pages[address];
        } else {
            content.innerHTML = `<div style="padding:20px;"><h1>404 - Not Found</h1><p>Internet Explorer cannot display the webpage.</p></div>`;
        }
    }
};
    
    loadArchive: function() {
        const stories = [
            { id: 1, title: "The Blue Screen of Death", author: "Clippy", content: "It was a dark and stormy night in the kernel... then everything turned blue." },
            { id: 2, title: "Bliss Hill Secrets", author: "XP_User", content: "Legend says if you walk over the green hill, you find the Windows Vista beta." }
        ];
        
        const container = document.getElementById('ie-content');
        
        // If a story is selected, show the reader
        if (this.currentStory) {
            container.innerHTML = `
                <button onclick="ieApp.currentStory = null; ieApp.navigate();" style="margin-bottom: 10px;">← Back to List</button>
                <div style="font-family: serif; background: #fff; padding: 20px; border: 1px solid #ccc;">
                    <h2 style="margin-top:0;">${this.currentStory.title}</h2>
                    <p><i>by ${this.currentStory.author}</i></p>
                    <hr>
                    <p style="line-height: 1.6;">${this.currentStory.content}</p>
                </div>
            `;
        } else {
            // Show the list
            container.innerHTML = `
                <div style="background: #900; color: white; padding: 5px; margin-bottom: 10px;">Archive of Our Own</div>
                ${stories.map(s => `
                    <div onclick='ieApp.readStory(${JSON.stringify(s)})' style="border: 1px solid #ddd; padding: 10px; cursor: pointer; margin-bottom: 5px; background: white;">
                        <h4 style="margin:0; color: #900;">${s.title}</h4>
                        <small>by ${s.author}</small>
                    </div>
                `).join('')}
            `;
        }
    },

    readStory: function(story) {
        this.currentStory = story;
        this.loadArchive();
    },

    navigate: function() {
        const address = document.getElementById('ie-address').value.toLowerCase();
        if (address.includes("archive")) {
            this.loadArchive();
        } else {
            this.currentStory = null; // Reset story if navigating away
            // ... rest of your navigation logic ...
        }
    }
};
