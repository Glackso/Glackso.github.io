const driveC = {
    "C:\\": [
        { name: "Windows", type: "folder" },
        { name: "Documents", type: "folder" },
        { name: "My Notes", type: "folder" } // Your new folder!
    ],
    "C:\\Windows": [
        { name: "System32", type: "folder" }
    ],
    "C:\\Documents": [
        { name: "Readme.txt", type: "file", content: "Welcome to Windows XP!\n\nThis is a simulation built for GitHub." }
    ],
    "C:\\My Notes": [
        // Empty by default, saved notes go here!
    ]
};

let currentHistory = ["C:\\"];
