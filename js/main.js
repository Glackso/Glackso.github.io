// js/main.js

import { Game } from './core/Game.js';

window.addEventListener('load', () => {
    // 1. Initialize the Core Game Engine
    const game = new Game();
    
    // 2. Grab the Menu Elements from the HTML
    const mainMenu = document.getElementById('main-menu');
    const deployBtn = document.getElementById('btn-deploy');

    // Draw a single frame immediately so the background grid shows behind the menu
    game.draw();

    // 3. Listen for the Deploy click
    deployBtn.addEventListener('click', () => {
        // Hide the main menu overlay
        mainMenu.style.display = 'none';
        
        // Start the continuous game loop
        game.loop();
    });
});
