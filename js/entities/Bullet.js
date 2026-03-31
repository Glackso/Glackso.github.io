import { Entity } from './Entity.js';

export class Bullet extends Entity {
    constructor(x, y, angle, speed, damage, color) {
        super(x, y, 10, color); 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.damage = damage;
        this.maxLife = 100;
        this.life = this.maxLife;
    }

    update() {
        super.update(); // Applies vx/vy to x/y
        this.life--;
    }

    draw(ctx) {
        // Fade out smoothly based on remaining life
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife); 
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = this.lineWidth;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.globalAlpha = 1.0; // Always reset transparency!
    }
}
