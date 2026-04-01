import { Entity } from './Entity.js';
import { Input } from '../core/Input.js';
import { Bullet } from './Bullet.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 20, '#00b2e1'); // Diep blue
        
        this.speed = 5;
        this.angle = 0;
        
        // Shooting stats
        this.cooldown = 0;
        this.reloadTime = 15; // Frames between shots
        this.bulletSpeed = 12;
        this.bulletDamage = 10;
    }

gainXP(amount) {
        if (this.level >= 45) return; 

        this.xp += amount;
        this.score += amount; 

        // New Curve: Early levels require very little XP, scaling up later
        let xpNeeded = Math.floor(20 * Math.pow(this.level, 1.5));

        while (this.xp >= xpNeeded && this.level < 45) {
            this.xp -= xpNeeded;
            this.level++;
            this.skillPoints++; 
            
            xpNeeded = Math.floor(20 * Math.pow(this.level, 1.5));
        }

        if (this.level >= 45) {
            this.xp = xpNeeded; 
        }
}

    update(game) {
        // 1. MOVEMENT (WASD / Arrows)
        let dx = 0;
        let dy = 0;
        
        if (Input.keys['w'] || Input.keys['arrowup']) dy -= 1;
        if (Input.keys['s'] || Input.keys['arrowdown']) dy += 1;
        if (Input.keys['a'] || Input.keys['arrowleft']) dx -= 1;
        if (Input.keys['d'] || Input.keys['arrowright']) dx += 1;

        // Normalize diagonal movement so you don't move 1.4x faster
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // 2. AIMING
        if (Input.toggles.autoSpin) {
            // [C] Auto-Spin rotates slightly every frame
            this.angle += 0.05; 
        } else {
            // Standard Aiming (Look at world mouse coordinates)
            this.angle = Math.atan2(Input.mouse.worldY - this.y, Input.mouse.worldX - this.x);
        }

        // 3. SHOOTING
        if (this.cooldown > 0) this.cooldown--;

        // Fire if Mouse is down OR [E] Auto-Fire is on
        if ((Input.mouse.down || Input.toggles.autoFire) && this.cooldown <= 0) {
            this.shoot(game);
        }
    }

    shoot(game) {
        // Calculate barrel tip position so bullet doesn't spawn in the center of the tank
        const barrelLength = 40;
        const tipX = this.x + Math.cos(this.angle) * barrelLength;
        const tipY = this.y + Math.sin(this.angle) * barrelLength;

        // Spawn bullet
        game.bullets.push(new Bullet(tipX, tipY, this.angle, this.bulletSpeed, this.bulletDamage, this.color));
        
        // Reset cooldown
        this.cooldown = this.reloadTime;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw Barrel (Underneath the body)
        ctx.fillStyle = '#999999';
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = this.lineWidth;
        
        // params: x, y, width, height. Y is negative half the height to center it.
        ctx.fillRect(0, -9, 40, 18);
        ctx.strokeRect(0, -9, 40, 18);

        // Draw Main Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
