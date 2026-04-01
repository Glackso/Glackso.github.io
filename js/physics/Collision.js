import { Vector } from './Vector.js';

export const Collision = {
    
    // Core circle-overlap check
    isColliding(entity1, entity2) {
        const dist = Vector.distance(entity1.x, entity1.y, entity2.x, entity2.y);
        return dist < (entity1.radius + entity2.radius);
    },

    // Helper to determine XP reward
    getXPReward(shapeType) {
        if (shapeType === 'square') return 10;
        if (shapeType === 'triangle') return 25;
        if (shapeType === 'pentagon') return 130;
        return 10; // Default fallback
    },

    // The main function called by Game.js every frame
    update(game) {
        this.checkBullets(game);
        this.checkEntities(game);
    },

    checkBullets(game) {
        // Iterate backwards
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
                        // --- XP ADDED HERE ---
                        // Only give XP if it's the player's bullet (assuming player bullets have a specific color or owner flag)
                        // If you don't have an owner flag yet, we just give it to the player for now.
                        const reward = this.getXPReward(shape.type);
                        game.player.gainXP(reward);
                        
                        game.shapes.splice(j, 1); 
                    }
                    break; 
                }
            }

            // 2. Bullets vs Enemies
            if (!hitSomething) {
                for (let e = game.enemies.length - 1; e >= 0; e--) {
                    let enemy = game.enemies[e];
                    
                    if (bullet.color !== enemy.color && this.isColliding(bullet, enemy)) {
                        enemy.health -= bullet.damage;
                        hitSomething = true;
                        
                        if (enemy.health <= 0) {
                            // Give XP for killing an enemy tank!
                            game.player.gainXP(500); // Or calculate based on enemy level
                            game.enemies.splice(e, 1);
                        }
                        break;
                    }
                }
            }

            if (hitSomething) {
                game.bullets.splice(i, 1);
            }
        }
    },

    checkEntities(game) {
        // 1. Player vs Shapes (Body Damage & Bumping)
        // Iterate backwards here too since we might remove items!
        for (let i = game.shapes.length - 1; i >= 0; i--) {
            let shape = game.shapes[i];
            
            if (this.isColliding(game.player, shape)) {
                Vector.preventOverlap(game.player, shape);
                
                shape.health -= 1; 
                game.player.health -= 1; 
                
                if (shape.health <= 0) {
                    // --- XP ADDED HERE FOR RAMMING ---
                    const reward = this.getXPReward(shape.type);
                    game.player.gainXP(reward);
                    
                    game.shapes.splice(i, 1);
                }
            }
        }

        // 2. Shapes vs Shapes
        for (let i = 0; i < game.shapes.length; i++) {
            for (let j = i + 1; j < game.shapes.length; j++) {
                if (this.isColliding(game.shapes[i], game.shapes[j])) {
                    Vector.preventOverlap(game.shapes[i], game.shapes[j]);
                }
            }
        }
    }
};
