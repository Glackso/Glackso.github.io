const AppRegistry = {
    computer: {
        title: "My Computer",
        width: "400px",
        icon: "assets/icons/16/computer.png",
        getContent: () => `
            <div class="field-row" style="padding: 20px; justify-content: center;">
                <div class="drive-item" style="text-align:center">
                    <img src="assets/icons/32/computer.png"><br>Local Disk (C:)
                </div>
            </div>`
    },
    counter: {
        title: "Counter.exe",
        width: "250px",
        getContent: () => `
            <p style="text-align: center">Current count: <span id="count-val">0</span></p>
            <div class="field-row" style="justify-content: center">
                <button onclick="document.getElementById('count-val').innerText++">+</button>
                <button onclick="document.getElementById('count-val').innerText--">-button>
                <button onclick="document.getElementById('count-val').innerText = 0">0</button>
            </div>`
    },
    cmd: {
        title: "Command Prompt",
        width: "500px",
        getContent: () => `
            <div style="background:black; color:white; font-family:monospace; padding:10px; height:200px;">
                Microsoft Windows XP [Version 5.1.2600]<br>C:\\Documents and Settings\\Admin> _
            </div>`
    }
};
