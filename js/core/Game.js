import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Collision } from '../physics/Collision.js';

// Import our Entities
import { Player } from '../entities/Player.js';
import { Bullet } from '../entities/Bullet.js';
import { Enemy } from '../entities/Enemy.js';
import { Shape } from '../entities/Shape.js';

// Import our UI Modules
import { HUD } from '../ui/HUD.js';
import { Upgrades } from '../ui/Upgrades.js';

// --- HELPER FUNCTIONS ---
// (We place these outside the class so they act as utilities)

const colors = {
    outline: '#555555',
    player: '#00b2e1',
    square: '#ffe869'
};

function drawRoundedBar(ctx, x, y, width, height, fillRatio, fillColor, text = "", isScreenSpace = false) {
    ctx.save();

    if (!isScreenSpace) {
        x = x - width / 2;
        y = y - height / 2;
    }

    // 1. Draw Background
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, height / 2);
    ctx.fillStyle = '#444444';
    ctx.fill();

    // 2. Draw Fill
    if (fillRatio > 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, width * fillRatio, height, height / 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    // 3. Draw Outline
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, height / 2);
    ctx.strokeStyle = colors.outline;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    if (text !== "") {
        ctx.font = `bold ${height * 0.75}px 'Segoe UI', Tahoma, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#333333';
        ctx.strokeText(text, x + width / 2, y + height / 2 + 1);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, x + width / 2, y + height / 2 + 1);
    }

    ctx.restore();
}

function drawEntityHealthBar(ctx, x, y, radius, hp, maxHp) {
    if (hp >= maxHp || hp <= 0) return; 
    
    const barWidth = radius * 2.5;
    const barHeight = 6;
    const barY = y + radius + 15; 
    
    ctx.save();
    ctx.fillStyle = '#555555'; 
    ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);
    
    const fillRatio = Math.max(0, hp / maxHp);
    ctx.fillStyle = '#85e37d'; 
    ctx.fillRect(x - barWidth / 2, barY, barWidth * fillRatio, barHeight);
    
    ctx.strokeStyle = colors.outline; 
    ctx.lineWidth = 2;
    ctx.strokeRect(x - barWidth / 2, barY, barWidth, barHeight);
    ctx.restore();
}

// --- MAIN GAME CLASS ---

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        Input.init();
        
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // 1. Game Arrays
        this.bullets = [];
        this.shapes = [];
        this.enemies = [];

        // 2. Spawn Player 
        this.player = new Player(1500, 1500);
        
        // Add RPG stats to player
        this.player.score = 0;
        this.player.level = 1;
        this.player.xp = 0;
        this.player.skillPoints = 33; 
        
        // Ensure player has HP data for the draw loop
        this.player.hp = 100;
        this.player.maxHp = 100;
        this.player.radius = 20;

        // 3. Initialize UI Modules
        this.hud = new HUD(this);
        this.upgrades = new Upgrades(this);

        for(let i = 0; i < 50; i++) this.spawnRandomShape();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.camera.resize(this.canvas.width, this.canvas.height);
    }

    spawnRandomShape() {
        const types = ['square', 'square', 'square', 'triangle', 'triangle', 'pentagon'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const x = Math.random() * 3000;
        const y = Math.random() * 3000;
        
        this.shapes.push(new Shape(x, y, randomType));
    }

    update() {
        const worldMouse = this.camera.screenToWorld(Input.mouse.x, Input.mouse.y);
        Input.mouse.worldX = worldMouse.x;
        Input.mouse.worldY = worldMouse.y;

        if (this.shapes.length < 100 && Math.random() < 0.05) {
            this.spawnRandomShape();
        }

        this.player.update(this);
        this.bullets.forEach(b => b.update());
        this.enemies.forEach(e => e.update(this));
        this.shapes.forEach(s => s.update());

        Collision.update(this);

        this.camera.update(this.player.x, this.player.y);
        this.hud.update();
        this.upgrades.update();

        this.bullets = this.bullets.filter(b => b.life > 0);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // --- CAMERA SPACE DRAWING ---
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.drawGrid();

        // Draw entities
        this.shapes.forEach(s => s.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        
        // Draw enemies and their health bars
        this.enemies.forEach(e => {
            e.draw(this.ctx);
            // Ensure enemies have hp, maxHp, and radius properties!
            if (e.hp !== undefined) {
                drawEntityHealthBar(this.ctx, e.x, e.y, e.radius || 20, e.hp, e.maxHp);
            }
        });

        // Draw Player
        this.player.draw(this.ctx);

        // --- DRAW PLAYER HP BAR ---
        // This is drawn in world space so it stays under the player tank
        const hpRatio = Math.max(0, this.player.hp / this.player.maxHp);
        drawRoundedBar(
            this.ctx, 
            this.player.x, 
            this.player.y + this.player.radius + 15, 
            45, 8, hpRatio, '#85e37d', "", false
        );

        this.ctx.restore();
        // --- END CAMERA SPACE ---
    }

    drawGrid() {
        const gridSize = 30;
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.lineWidth = 1;

        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;

        this.ctx.beginPath();
        for (let x = startX; x < this.camera.x + this.canvas.width; x += gridSize) {
            this.ctx.moveTo(x, this.camera.y);
            this.ctx.lineTo(x, this.camera.y + this.canvas.height);
        }
        for (let y = startY; y < this.camera.y + this.canvas.height; y += gridSize) {
            this.ctx.moveTo(this.camera.x, y);
            this.ctx.lineTo(this.camera.x + this.canvas.width, y);
        }
        this.ctx.stroke();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
