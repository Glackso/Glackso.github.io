import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Collision } from '../physics/Collision.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        Input.init();
        
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Placeholders (We will replace this with a real Player class later)
        this.player = { x: 0, y: 0, radius: 20 };
        this.entities = [];
        this.bullets = [];
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.camera.resize(this.canvas.width, this.canvas.height);
    }

    update() {
        // --- 1. PROCESS INPUTS ---
        
        // Calculate World Mouse Position for Aiming
        const worldMouse = this.camera.screenToWorld(Input.mouse.x, Input.mouse.y);
        Input.mouse.worldX = worldMouse.x;
        Input.mouse.worldY = worldMouse.y;

        // Example: Process Stat Upgrades queued from Input.js
        while (Input.upgradesToApply.length > 0) {
            let statIndex = Input.upgradesToApply.shift();
            // TODO: Pass this to your Player/Stats class (e.g., this.player.upgradeStat(statIndex); )
            console.log(`Upgrading Stat Index: ${statIndex}`); 
        }

        // --- 2. UPDATE ENTITIES ---
        
        // Temporary movement just to test camera lerping
        if (Input.keys['w'] || Input.keys['arrowup']) this.player.y -= 5;
        if (Input.keys['s'] || Input.keys['arrowdown']) this.player.y += 5;
        if (Input.keys['a'] || Input.keys['arrowleft']) this.player.x -= 5;
        if (Input.keys['d'] || Input.keys['arrowright']) this.player.x += 5;

        // --- 3. UPDATE CAMERA ---
        this.camera.update(this.player.x, this.player.y);
        Collision.update(this);
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

        // 2. Draw Dummy Player
        this.ctx.fillStyle = '#00b2e1';
        this.ctx.strokeStyle = '#555555';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

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
