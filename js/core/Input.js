export const Input = {
    keys: {},
    mouse: { x: 0, y: 0, worldX: 0, worldY: 0, down: false },
    
    // Toggles for Auto-Fire (E) and Auto-Spin (C)
    toggles: { autoFire: false, autoSpin: false },
    
    // Queue for single-press actions like upgrading stats
    upgradesToApply: [], 

    init() {
        // Track key hold-downs (WASD)
        window.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;

            // e.repeat is true if the user holds the key down.
            // We only want toggles and upgrades to fire ONCE per press.
            if (!e.repeat) {
                // Auto-Fire / Auto-Spin
                if (key === 'e') this.toggles.autoFire = !this.toggles.autoFire;
                if (key === 'c') this.toggles.autoSpin = !this.toggles.autoSpin;

                // Upgrades (Keys 1 through 8)
                if (e.key >= '1' && e.key <= '8') {
                    // Convert '1' to index 0, '2' to index 1, etc.
                    this.upgradesToApply.push(parseInt(e.key) - 1);
                }
            }
        });

        window.addEventListener('keyup', e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Track Mouse
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.down = true; // 0 is Left Click
        });
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.down = false;
        });
    }
};
