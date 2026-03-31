import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Collision } from '../physics/Collision.js';
import { Player } from '../entities/Player.js';
import { HUD } from '../ui/HUD.js';
import { Upgrades } from '../ui/Upgrades.js';
import { Enemy } from '../entities/Enemy.js'; // Import when ready to spawn
import { Shape } from '../entities/Shape.js'; // Import when ready to spawn

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        Input.init();
        
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Game Arrays
        this.bullets = [];
        this.shapes = [];
        this.enemies = [];

        // Spawn Player at 1500, 1500 (Center of a 3000x3000 world)
        this.player = new Player(1500, 1500);
        
        // Add new RPG stats to player so UI doesn't crash
        this.player.score = 0;
        this.player.level = 1;
        this.player.xp = 0;
        this.player.skillPoints = 5; // Give them 5 points to test the menu

        // Initialize UI Modules
        this.hud = new HUD(this);
        this.upgrades = new Upgrades(this);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.camera.resize(this.canvas.width, this.canvas.height);
    }

    update() {
        // 1. Process Aiming Input
        const worldMouse = this.camera.screenToWorld(Input.mouse.x, Input.mouse.y);
        Input.mouse.worldX = worldMouse.x;
        Input.mouse.worldY = worldMouse.y;

        // 2. Update Entities
        this.player.update(this);
        this.bullets.forEach(b => b.update());
        this.enemies.forEach(e => e.update(this));
        this.shapes.forEach(s => s.update());

        // 3. Process Physics & Collisions
        Collision.update(this);

        // 4. Update Camera & UI
        this.camera.update(this.player.x, this.player.y);
        this.hud.update();
        this.upgrades.update();

        // 5. Cleanup dead entities
        this.bullets = this.bullets.filter(b => b.life > 0);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.drawGrid();

        // Draw entities (Lowest z-index first)
        this.shapes.forEach(s => s.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.player.draw(this.ctx);

        this.ctx.restore();
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
