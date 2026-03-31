export class Entity {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.color = color;
        
        this.health = 100;
        this.maxHealth = 100;
        
        // Universal style properties for this game
        this.outlineColor = '#555555';
        this.lineWidth = 3.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        // Base draw just draws a colored circle (overridden by specific classes)
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}
