import { Vector } from './Vector.js';

export const Collision = {
    
    // Core circle-overlap check
    isColliding(entity1, entity2) {
        const dist = Vector.distance(entity1.x, entity1.y, entity2.x, entity2.y);
        return dist < (entity1.radius + entity2.radius);
    },

    // The main function called by Game.js every frame
    update(game) {
        this.checkBullets(game);
        this.checkEntities(game);
    },

    checkBullets(game) {
        // Iterate backwards when removing items from an array to prevent index shifting bugs
        for (let i = game.bullets.length - 1; i >= 0; i--) {
            let bullet = game.bullets[i];
            let hitSomething = false;

            // 1. Bullets vs Shapes
            for (let j = game.shapes.length - 1; j >= 0; j--) {
                let shape = game.shapes[j];
                
                if (this.isColliding(bullet, shape)) {
                    shape.health -= bullet.damage;
                    hitSomething = true;
                    
                    if (shape.health <= 0) {
                        // TODO: Add score/XP to the player who shot the bullet
                        game.shapes.splice(j, 1); 
                    }
                    break; // Bullet is destroyed, stop checking other shapes
                }
            }

            // 2. Bullets vs Enemies (Only if the bullet hasn't hit a shape yet)
            if (!hitSomething) {
                for (let e = game.enemies.length - 1; e >= 0; e--) {
                    let enemy = game.enemies[e];
                    
                    // Don't let enemies shoot themselves or other enemies (basic friendly fire check)
                    if (bullet.color !== enemy.color && this.isColliding(bullet, enemy)) {
                        enemy.health -= bullet.damage;
                        hitSomething = true;
                        
                        if (enemy.health <= 0) {
                            game.enemies.splice(e, 1);
                        }
                        break;
                    }
                }
            }

            // If the bullet hit anything, remove it from the game
            if (hitSomething) {
                game.bullets.splice(i, 1);
            }
        }
    },

    checkEntities(game) {
        // 1. Player vs Shapes (Body Damage & Bumping)
        game.shapes.forEach((shape, index) => {
            if (this.isColliding(game.player, shape)) {
                Vector.preventOverlap(game.player, shape);
                
                // In Diep, bumping shapes hurts both the tank and the shape
                shape.health -= 1; // Base body damage
                game.player.health -= 1; 
                
                if (shape.health <= 0) game.shapes.splice(index, 1);
            }
        });

        // 2. Shapes vs Shapes (So they don't clump up into a single point)
        for (let i = 0; i < game.shapes.length; i++) {
            for (let j = i + 1; j < game.shapes.length; j++) {
                if (this.isColliding(game.shapes[i], game.shapes[j])) {
                    Vector.preventOverlap(game.shapes[i], game.shapes[j]);
                }
            }
        }
    }
};
