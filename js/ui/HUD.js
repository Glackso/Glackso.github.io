export class HUD {
    constructor(game) {
        this.game = game;
        
        const bottomBars = document.querySelectorAll('#bottom-ui .bar-bg');
        
        // Top Bar: Progress to 1st Place & Name/Score
        this.leaderFill = bottomBars[0].querySelector('.bar-fill');
        this.nameScoreText = bottomBars[0].querySelector('.bar-text');
        
        // Bottom Bar: XP Progress & Level
        this.xpFill = bottomBars[1].querySelector('.bar-fill');
        this.levelText = bottomBars[1].querySelector('.bar-text');

        // Minimap
        this.minimapDot = document.getElementById('minimap-dot');
        this.worldWidth = 3000; 
        this.worldHeight = 3000;
        this.scoreboardText = document.querySelector('#scoreboard .score-bar:nth-child(2) .bar-text');
    }

    update() {
        const player = this.game.player;
        if (!player) return;

        // 1. Top Bar: Progress to 1st place
        const topScore = this.game.topScore || Math.max(player.score, 1);
        const leaderPercent = Math.min(100, (player.score / topScore) * 100);
        this.leaderFill.style.width = `${leaderPercent}%`;
        
        if (leaderPercent >= 100) {
            this.leaderFill.style.backgroundColor = '#00FF00'; // First place is green!
        } else {
            this.leaderFill.style.backgroundColor = ''; 
        }
        
        this.nameScoreText.innerText = `${player.name || "Player"} - Score: ${Math.floor(player.score || 0)}`;

        // 2. Bottom Bar: XP & Level
        // Using your XP_TO_LEVEL constant here
        const xpPercent = Math.min(100, ((player.xp || 0) / 1000) * 100); 
        this.xpFill.style.width = `${xpPercent}%`;
        this.levelText.innerText = `Lvl ${player.level || 1} Tank`;

        // 3. Minimap Dot
        const mapX = Math.max(0, Math.min(100, (player.x / this.worldWidth) * 100));
        const mapY = Math.max(0, Math.min(100, (player.y / this.worldHeight) * 100));
        this.minimapDot.style.left = `${mapX}%`;
        this.minimapDot.style.top = `${mapY}%`;
        // Update Scoreboard Text
        if (this.scoreboardText) {
            this.scoreboardText.innerText = `${player.name || "Player"} - ${Math.floor(player.score || 0)}`;
        }
    }
}
