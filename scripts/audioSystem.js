// ================= AUDIO ENGINE =================
const AudioEngine = {
    play: function(soundId) {
        const sounds = {
            'startup': 'assets/sounds/startup.wav',
            'click': 'assets/sounds/click.wav'
        };
        
        if (sounds[soundId]) {
            const audio = new Audio(sounds[soundId]);
            audio.play().catch(e => console.log('Browser blocked autoplay until user interaction.'));
        }
    }
};
