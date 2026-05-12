let highestZIndex = 100;

const SystemState = {
    save: function() {
        const state = {
            files: driveC,
            wallpaper: document.body.style.backgroundImage,
        };
        localStorage.setItem('xp_sim_state', JSON.stringify(state));
    },

    load: function() {
        const saved = localStorage.getItem('xp_sim_state');
        if (saved) {
            const state = JSON.parse(saved);
            if (state.files) Object.assign(driveC, state.files);
            if (state.wallpaper) document.body.style.backgroundImage = state.wallpaper;
        }
    },

    login: function() {
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) loginScreen.style.display = 'none';
        playSound('startup');
        this.load();
        renderShortcuts(); // Ensure icons load after files are restored
    },

    shutdown: function() {
        document.body.innerHTML = '<div style="background:black; color:white; height:100vh; display:flex; align-items:center; justify-content:center; font-family:Tahoma;">It is now safe to turn off your computer.</div>';
    }
};

function focusWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-win'));
    win.classList.add('active-win');
    
    document.querySelectorAll('.taskbar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`taskbar-btn-${id}`)?.classList.add('active');
}

function playSound(soundName) {
    const audio = new Audio(`assets/sounds/${soundName}.wav`);
    audio.play().catch(e => console.log("Sound blocked by browser until interaction."));
}

function bootSystem() {
    renderShortcuts();
    setInterval(() => {
        const clock = document.getElementById('clock');
        if (clock) clock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}
