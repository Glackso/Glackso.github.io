import { Input } from '../core/Input.js';

export class Upgrades {
    constructor(game) {
        this.game = game;
        
        // Diep standard: 8 stats, max 7 points each
        this.statNames = [
            'healthRegen', 'maxHealth', 'bodyDamage', 'bulletSpeed', 
            'bulletPenetration', 'bulletDamage', 'reload', 'movementSpeed'
        ];
        
        this.statLevels = [0, 0, 0, 0, 0, 0, 0, 0];
        this.maxStatLevel = 7;
        
        this.menuContainer = document.getElementById('stat-menu');
        this.headerText = this.menuContainer.querySelector('.stat-header');
        
        this.rows = this.menuContainer.querySelectorAll('.stat-row');
        this.setupListeners();
    }

    setupListeners() {
        this.rows.forEach((row, index) => {
            const btn = row.querySelector('.stat-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    this.tryUpgrade(index);
                });
            }
        });
    }

    update() {
        const player = this.game.player;
        if (!player) return;

        // 1. Check Keyboard Inputs (1-8 queue from Input.js)
        while (Input.upgradesToApply && Input.upgradesToApply.length > 0) {
            let statIndex = Input.upgradesToApply.shift();
            if (statIndex >= 0 && statIndex <= 7) {
                this.tryUpgrade(statIndex);
            }
        }

        // 2. Update Menu Visibility and Text
        if (player.skillPoints > 0) {
            this.menuContainer.style.opacity = '1';
            this.menuContainer.style.pointerEvents = 'auto';
            this.headerText.innerText = `x${player.skillPoints} Stats Available`;
        } else {
            this.menuContainer.style.opacity = '0.5';
            this.menuContainer.style.pointerEvents = 'none'; // Prevent clicking when empty
            this.headerText.innerText = `Max Stats Reached`;
        }

        // 3. Update Visual Bars for Stats
        this.rows.forEach((row, index) => {
            const fill = row.querySelector('.stat-fill');
            if (fill) {
                const percent = (this.statLevels[index] / this.maxStatLevel) * 100;
                fill.style.width = `${percent}%`;
            }
        });
    }

    tryUpgrade(index) {
        const player = this.game.player;
        if (player.skillPoints > 0 && this.statLevels[index] < this.maxStatLevel) {
            player.skillPoints--;
            this.statLevels[index]++;
            
            this.applyStatToPlayer(player, index);
        }
    }

    applyStatToPlayer(player, index) {
        const stat = this.statNames[index];
        
        switch(stat) {
            case 'healthRegen': 
                player.regenRate += 0.05; break;
            case 'maxHealth': 
                player.maxHp += 20; 
                player.hp += 20; // Heal them instantly for the amount added
                break;
            case 'bodyDamage': 
                player.bodyDamage += 3; break;
            case 'bulletSpeed': 
                player.bulletSpeed += 1.5; break;
            case 'bulletPenetration': 
                player.bulletPenetration += 1; break; 
            case 'bulletDamage': 
                player.bulletDamage += 3; break;
            case 'reload': 
                // Math.max prevents reload from going below 3 frames (which breaks the game)
                player.reloadTime = Math.max(3, player.reloadTime - 3); break; 
            case 'movementSpeed': 
                player.speed += 0.6; break;
        }
    }
}
    setupListeners() {
        this.rows.forEach((row, index) => {
            const btn = row.querySelector('.stat-btn');
            // Allow clicking the '+' button
            btn.addEventListener('click', () => {
                this.tryUpgrade(index);
            });
        });
    }

    update() {
        const player = this.game.player;
        if (!player) return;

        // 1. Check Keyboard Inputs (1-8 queue from Input.js)
        while (Input.upgradesToApply.length > 0) {
            let statIndex = Input.upgradesToApply.shift();
            if (statIndex >= 0 && statIndex <= 7) {
                this.tryUpgrade(statIndex);
            }
        }

        // 2. Update Menu Visibility and Text
        if (player.skillPoints > 0) {
            this.menuContainer.style.opacity = '1';
            this.headerText.innerText = `x${player.skillPoints} Stats Available`;
        } else {
            // Fade out the menu slightly if no points are available
            this.menuContainer.style.opacity = '0.5';
            this.headerText.innerText = `Max Stats Reached`;
        }

        // 3. Update Visual Bars for Stats
        this.rows.forEach((row, index) => {
            const fill = row.querySelector('.stat-fill');
            const percent = (this.statLevels[index] / this.maxStatLevel) * 100;
            fill.style.width = `${percent}%`;
        });
    }

    tryUpgrade(index) {
        const player = this.game.player;
        if (player.skillPoints > 0 && this.statLevels[index] < this.maxStatLevel) {
            // Deduct point and increase level
            player.skillPoints--;
            this.statLevels[index]++;
            
            // Apply the actual stat change to the player object
            this.applyStatToPlayer(player, index);
        }
    }

    applyStatToPlayer(player, index) {
        const stat = this.statNames[index];
        
        // Adjust these mathematical multipliers to balance your game
        switch(stat) {
            case 'healthRegen': 
                player.regenRate += 0.05; break;
            case 'maxHealth': 
                player.maxHealth += 20; 
                player.health += 20; // Heal them slightly on upgrade
                break;
            case 'bodyDamage': 
                player.bodyDamage += 5; break;
            case 'bulletSpeed': 
                player.bulletSpeed += 1.5; break;
            case 'bulletPenetration': 
                player.bulletHealth += 5; break; // Needs custom logic in Bullet.js
            case 'bulletDamage': 
                player.bulletDamage += 3; break;
            case 'reload': 
                player.reloadTime = Math.max(2, player.reloadTime - 2); break; // Lower is faster
            case 'movementSpeed': 
                player.speed += 0.5; break;
        }
    }
}
