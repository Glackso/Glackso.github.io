const virtualFS = {
    "C:": {
        "Windows": ["system32", "Web", "Media"],
        "Documents and Settings": ["Administrator", "All Users"],
        "Program Files": ["Internet Explorer", "Movie Maker"]
    }
};

function openFolder(path) {
    alert("Navigating to: " + path);
    // You can update the innerHTML of the current window-body here
}
