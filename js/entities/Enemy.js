import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';

export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 20, '#f14e54'); // Diep red for enemies
        
        this.speed = 2.5; // Slightly slower than the player
        this.angle = 0;
        
        // Shooting stats
        this.cooldown = 0;
        this.reloadTime = 45; // Shoots slower than the player
        this.bulletSpeed = 8;
        this.bulletDamage = 5;
        
        // Detection radius (how close you have to be for it to notice you)
        this.aggroRange = 600; 
    }

    update(game) {
        // 1. CALCULATE DISTANCE TO PLAYER
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. AI LOGIC (Chase and Shoot)
        if (distance < this.aggroRange) {
            // Aim at player
            this.angle = Math.atan2(dy, dx);

            // Move towards player (but stop if getting too close to avoid overlapping)
            if (distance > 150) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
            }

            // Shoot
            if (this.cooldown > 0) this.cooldown--;
            if (this.cooldown <= 0) {
                this.shoot(game);
            }
        } else {
            // Optional: Add wandering logic here when the player is far away
            // For now, they just spin slowly if idle
            this.angle += 0.01;
        }
    }

    shoot(game) {
        const barrelLength = 40;
        const tipX = this.x + Math.cos(this.angle) * barrelLength;
        const tipY = this.y + Math.sin(this.angle) * barrelLength;

        // Spawn a red bullet
        game.bullets.push(new Bullet(tipX, tipY, this.angle, this.bulletSpeed, this.bulletDamage, this.color));
        
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
        
        ctx.fillRect(0, -9, 40, 18);
        ctx.strokeRect(0, -9, 40, 18);

        // Draw Main Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        
        // Optional: Draw a small health bar above the enemy
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        if (this.health >= this.maxHealth) return; // Only show if damaged
        
        const barWidth = 40;
        const barHeight = 6;
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        
        ctx.save();
        ctx.translate(this.x, this.y + this.radius + 15);
        
        // Background (empty)
        ctx.fillStyle = '#555555';
        ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
        
        // Foreground (fill)
        ctx.fillStyle = '#85e37d'; // Green health
        ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
        
        ctx.restore();
    }
}
