import { Input } from './Input.js';
import { Player } from '../entities/Player.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        Input.init(); // Start listening to keys/mouse
        
        // Spawn player in the center
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.bullets = [];
    }
    
    update() {
        this.player.update(this);
        this.bullets.forEach(b => b.update());
        
        // Clean up dead bullets
        this.bullets = this.bullets.filter(b => b.life > 0);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bullets.forEach(b => b.draw(this.ctx));
        this.player.draw(this.ctx);
    }
    
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
