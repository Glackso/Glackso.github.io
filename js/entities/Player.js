import { Entity } from './Entity.js';
import { Input } from '../core/Input.js';
import { Bullet } from './Bullet.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = 4;
        this.angle = 0;
        this.cooldown = 0; // Prevents shooting 60 bullets a second
    }
    
    update(game) {
        // Movement
        if (Input.keys['KeyW']) this.y -= this.speed;
        if (Input.keys['KeyS']) this.y += this.speed;
        if (Input.keys['KeyA']) this.x -= this.speed;
        if (Input.keys['KeyD']) this.x += this.speed;

        // Aiming
        this.angle = Math.atan2(Input.mouse.y - this.y, Input.mouse.x - this.x);

        // Shooting
        if (this.cooldown > 0) this.cooldown--;
        if (Input.mouse.down && this.cooldown === 0) {
            // Spawn bullet at the tip of the barrel
            let bx = this.x + Math.cos(this.angle) * 30;
            let by = this.y + Math.sin(this.angle) * 30;
            
            game.bullets.push(new Bullet(bx, by, this.angle));
            this.cooldown = 15; // Wait 15 frames before shooting again
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Barrel
        ctx.fillStyle = '#999';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3;
        ctx.fillRect(0, -12, 35, 24);
        ctx.strokeRect(0, -12, 35, 24);
        
        // Body
        ctx.fillStyle = '#00b2e1';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
}
