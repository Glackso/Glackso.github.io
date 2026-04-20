const AudioEngine = {
    play: function(soundName) {
        let file = '';
        if (soundName === 'startup') file = 'assets/sounds/startup.wav';
        if (soundName === 'click') file = 'assets/sounds/click.wav'; // For future use
        
        if (file) {
            const audio = new Audio(file);
            audio.play().catch(e => console.log("Browser blocked auto-play until user clicks."));
        }
    }
};
