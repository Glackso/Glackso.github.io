import { Game } from './core/Game.js';
// We will eventually import HUD here: import { HUD } from './ui/HUD.js';

window.addEventListener('load', () => {
    // 1. Initialize the Core Game Engine
    const game = new Game();
    
    // 2. Initialize the UI layer (We will build this module later)
    // const hud = new HUD(game);
    
    // 3. Start the continuous game loop
    game.loop();
});
