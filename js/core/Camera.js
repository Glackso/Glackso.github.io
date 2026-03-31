export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        
        // Lower number = looser, "floatier" camera. Higher number = stiffer camera.
        this.lerpSpeed = 0.1; 
    }

    update(targetX, targetY) {
        // Calculate where the top-left corner of the screen SHOULD be to center the player
        let desiredX = targetX - this.width / 2;
        let desiredY = targetY - this.height / 2;

        // Lerp Formula: Current = Current + (Target - Current) * Speed
        this.x += (desiredX - this.x) * this.lerpSpeed;
        this.y += (desiredY - this.y) * this.lerpSpeed;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    // Crucial for aiming: Converts your screen mouse X/Y into game world X/Y
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}
