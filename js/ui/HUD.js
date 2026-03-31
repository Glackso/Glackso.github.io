export class HUD {
    constructor(game) {
        this.game = game;
        
        // Cache DOM elements so we aren't searching for them every frame (better performance)
        const bottomBars = document.querySelectorAll('#bottom-ui .bar-bg');
        
        // Assuming the first bar is Health/Score, and the second is XP/Level based on your HTML
        this.healthFill = bottomBars[0].querySelector('.bar-fill');
        this.scoreText = bottomBars[0].querySelector('.bar-text');
        
        this.xpFill = bottomBars[1].querySelector('.bar-fill');
        this.levelText = bottomBars[1].querySelector('.bar-text');

        // Minimap
        this.minimapDot = document.getElementById('minimap-dot');
        
        // World bounds (used to calculate minimap percentages)
        this.worldWidth = 3000; 
        this.worldHeight = 3000;
    }

    update() {
        const player = this.game.player;
        if (!player) return;

        // 1. Update Bottom Center UI
        const healthPercent = Math.max(0, (player.health / player.maxHealth) * 100);
        this.healthFill.style.width = `${healthPercent}%`;
        this.scoreText.innerText = `Score: ${Math.floor(player.score || 0)}`;

        // Calculate XP percentage (Placeholder math: Level * 100 is max XP for next level)
        const currentMaxXP = (player.level || 1) * 100; 
        const xpPercent = Math.min(100, ((player.xp || 0) / currentMaxXP) * 100);
        this.xpFill.style.width = `${xpPercent}%`;
        this.levelText.innerText = `Lvl ${player.level || 1} Tank`;

        // 2. Update Minimap Dot Position
        // Convert player world coordinates to a percentage (0% to 100%)
        const mapX = Math.max(0, Math.min(100, (player.x / this.worldWidth) * 100));
        const mapY = Math.max(0, Math.min(100, (player.y / this.worldHeight) * 100));
        
        this.minimapDot.style.left = `${mapX}%`;
        this.minimapDot.style.top = `${mapY}%`;
    }
}
