const driveC = {
    "C:\\": [
        { name: "Windows", type: "folder" },
        { name: "Documents", type: "folder" },
        { name: "Readme.txt", type: "file", content: "Welcome to Windows XP!\n\nThis is a simulation built for GitHub." }
    ],
    "C:\\Windows": [
        { name: "System32", type: "folder" },
        { name: "notepad.exe", type: "file", content: "You found the notepad executable!" }
    ],
    "C:\\Documents": [
        { name: "Ideas.txt", type: "file", content: "- Build a taskbar\n- Add a Start Menu\n- Win the internet" }
    ]
};

let currentHistory = ["C:\\"];
