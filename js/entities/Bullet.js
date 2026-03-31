import { Entity } from './Entity.js';

export class Bullet extends Entity {
    constructor(x, y, angle) {
        super(x, y); // Calls the Entity constructor
        this.speed = 8;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.life = 100; // Frames before it disappears
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#f14e54';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}
