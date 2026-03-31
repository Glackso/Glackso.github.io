import { Entity } from './Entity.js';

export class Shape extends Entity {
    constructor(x, y, type) {
        let radius, color, sides, health;

        // Configure based on shape type
        if (type === 'square') {
            radius = 15; color = '#ffe869'; sides = 4; health = 10;
        } else if (type === 'triangle') {
            radius = 18; color = '#f14e54'; sides = 3; health = 30;
        } else if (type === 'pentagon') {
            radius = 25; color = '#768dfc'; sides = 5; health = 100;
        } else {
            // Default fallback
            radius = 15; color = '#ffe869'; sides = 4; health = 10;
        }

        super(x, y, radius, color);
        
        this.sides = sides;
        this.health = health;
        this.maxHealth = health;
        this.angle = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.02; // Slow random rotation
    }

    update() {
        super.update();
        this.angle += this.spinSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = "round"; // Makes the sharp corners look nicer

        // Draw the polygon
        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const currentAngle = (i * 2 * Math.PI) / this.sides;
            const px = Math.cos(currentAngle) * this.radius;
            const py = Math.sin(currentAngle) * this.radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
