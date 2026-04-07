// scripts/apps/notepad.js

// This function downloads the content of the textarea as a real .txt file
function saveNotepadText() {
    // Find the textarea inside the notepad window
    const textArea = document.querySelector('#notepad textarea');
    const textContent = textArea.value;

    // Create a "Blob" (a bundle of raw data)
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Create a temporary, invisible download link
    const anchor = document.createElement('a');
    anchor.download = 'Untitled.txt';
    anchor.href = window.URL.createObjectURL(blob);
    
    // Fake a click on the link to trigger the download, then clean it up
    anchor.click();
    window.URL.revokeObjectURL(anchor.href);
}
