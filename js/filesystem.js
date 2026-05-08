const fs = {
    "C:": {
        "Windows": {},
        "Program Files": {},
        "Documents and Settings": {
            "User": {
                "My Documents": ["resume.txt", "notes.txt"],
                "My Pictures": ["autumn.jpg", "redmoon.jpg"]
            }
        }
    }
};

function getAppContent(id) {
    if (id === 'computer') {
        return `
            <div class="folder-view">
                <div class="drive-item"><img src="assets/icons/32/computer.png"> 3½ Floppy (A:)</div>
                <div class="drive-item"><img src="assets/icons/32/computer.png"> Local Disk (C:)</div>
                <div class="drive-item"><img src="assets/icons/32/computer.png"> CD Drive (D:)</div>
            </div>
        `;
    }
    return `<p>Welcome to ${id}!</p>`;
}
