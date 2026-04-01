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

        // 2. Spawn Player (Center of a hypothetical 3000x3000 world)
        this.player = new Player(1500, 1500);
        
        // Add RPG stats to player so the UI has data to read
        this.player.score = 0;
        this.player.level = 1;
        this.player.xp = 0;
        this.player.skillPoints = 33; // Give a bunch of points to test the upgrade menu

        // 3. Initialize UI Modules
        this.hud = new HUD(this);
        this.upgrades = new Upgrades(this);

        // Pre-spawn some shapes so the map isn't empty
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
        
        // Spawn randomly within the 3000x3000 world
        const x = Math.random() * 3000;
        const y = Math.random() * 3000;
        
        this.shapes.push(new Shape(x, y, randomType));
    }

    update() {
        // --- 1. PROCESS INPUTS ---
        const worldMouse = this.camera.screenToWorld(Input.mouse.x, Input.mouse.y);
        Input.mouse.worldX = worldMouse.x;
        Input.mouse.worldY = worldMouse.y;

        // --- 2. SPAWNERS ---
        // Keep the map populated with shapes (max 100)
        if (this.shapes.length < 100 && Math.random() < 0.05) {
            this.spawnRandomShape();
        }

        // --- 3. UPDATE ENTITIES ---
        this.player.update(this);
        this.bullets.forEach(b => b.update());
        this.enemies.forEach(e => e.update(this));
        this.shapes.forEach(s => s.update());

        // --- 4. PROCESS PHYSICS & COLLISIONS ---
        Collision.update(this);

        // --- 5. UPDATE CAMERA & UI ---
        this.camera.update(this.player.x, this.player.y);
        this.hud.update();
        this.upgrades.update();

        // --- 6. CLEANUP ---
        // Remove dead bullets from the array
        this.bullets = this.bullets.filter(b => b.life > 0);
    }

    draw() {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save canvas state before applying camera transformations
        this.ctx.save();
        
        // Shift the entire canvas in the opposite direction of the camera
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // 1. Draw Grid
        this.drawGrid();

        // 2. Draw Entities (Lowest z-index first)
        this.shapes.forEach(s => s.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.player.draw(this.ctx);

        // Restore canvas state so UI doesn't get shifted by the camera
        this.ctx.restore();
    }

    drawGrid() {
        const gridSize = 30;
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.lineWidth = 1;

        // Only draw grid lines that are currently visible on the camera
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
