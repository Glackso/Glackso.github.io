import { Entity } from './Entity.js';
import { Input } from '../core/Input.js';
import { Bullet } from './Bullet.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 20, '#00b2e1'); // Diep blue
        
        // --- RPG & Leveling Stats ---
        this.score = 0;
        this.level = 1;
        this.xp = 0;
        this.skillPoints = 0; 
        
        // --- Upgradable Base Stats ---
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.regenRate = 0.02;  // Base healing per frame
        this.bodyDamage = 5;    // Base damage when ramming
        this.speed = 5;         // Movement speed

        // --- Upgradable Shooting Stats ---
        this.cooldown = 0;
        this.reloadTime = 25;   // Base reload (frames between shots)
        this.bulletSpeed = 10;
        this.bulletDamage = 10;
        this.bulletPenetration = 1; // How many things a bullet can hit
    }

    gainXP(amount) {
        if (this.level >= 45) return; // Cap at max level

        this.xp += amount;
        this.score += amount; 

        // New Diep Curve: Early levels are fast!
        let xpNeeded = Math.floor(20 * Math.pow(this.level, 1.5));

        while (this.xp >= xpNeeded && this.level < 45) {
            this.xp -= xpNeeded; 
            this.level++;
            this.skillPoints++; // Give a stat upgrade point
            
            xpNeeded = Math.floor(20 * Math.pow(this.level, 1.5));
        }

        if (this.level >= 45) {
            this.xp = xpNeeded; // Keep the bar visually full at max level
        }
    }

    update(game) {
        // --- PASSIVE REGEN ---
        if (this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + this.regenRate);
        }

        // 1. MOVEMENT (WASD / Arrows)
        let dx = 0;
        let dy = 0;
        
        if (Input.keys['w'] || Input.keys['arrowup']) dy -= 1;
        if (Input.keys['s'] || Input.keys['arrowdown']) dy += 1;
        if (Input.keys['a'] || Input.keys['arrowleft']) dx -= 1;
        if (Input.keys['d'] || Input.keys['arrowright']) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // 2. AIMING
        if (Input.toggles.autoSpin) {
            this.angle += 0.05; 
        } else {
            this.angle = Math.atan2(Input.mouse.worldY - this.y, Input.mouse.worldX - this.x);
        }

        // 3. SHOOTING
        if (this.cooldown > 0) this.cooldown--;

        if ((Input.mouse.down || Input.toggles.autoFire) && this.cooldown <= 0) {
            this.shoot(game);
        }
    }

    shoot(game) {
        const barrelLength = 40;
        const tipX = this.x + Math.cos(this.angle) * barrelLength;
        const tipY = this.y + Math.sin(this.angle) * barrelLength;

        // NOTE: Make sure your Bullet.js constructor accepts penetration if you want it to pierce!
        game.bullets.push(new Bullet(
            tipX, tipY, this.angle, 
            this.bulletSpeed, this.bulletDamage, this.color
        ));
        
        this.cooldown = this.reloadTime;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = '#999999';
        ctx.strokeStyle = this.outlineColor || '#555555';
        ctx.lineWidth = this.lineWidth || 3.5;
        
        ctx.fillRect(0, -9, 40, 18);
        ctx.strokeRect(0, -9, 40, 18);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
