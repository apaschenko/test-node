'use strict';

const Enemy = require('./enemy');

module.exports = class Game {
    constructor(data) {
        this.firingRange = data.firingRange;
        this.enemies = data.enemies.reduce((enemies, enemyData) => {
            enemies.push(new Enemy(enemyData));
            return enemies;
        }, []);

        this.firstRoundHistory = [];
        this.lose = true;
    }

    playRound(roundNumber, firingRange) {
        for (let numOfTurn = 0; true; numOfTurn++) {
            this.enemies.forEach((enemy) => {
                enemy.positioning(numOfTurn, firingRange);
            });

            // shot simulating
            const availableEnemies = this.enemies.filter(enemy =>
                enemy.isAlive && enemy.isInBattle
            );

            if (availableEnemies.length > 0) {
                // the tower kills the enemy who can reach the tower first
                availableEnemies.sort((a, b) => a.turnsToReachTheTower - b.turnsToReachTheTower);
                availableEnemies[0].kill();
                if (roundNumber === 0) {
                    this.firstRoundHistory.push({
                        turn: numOfTurn,
                        name: availableEnemies[0].name
                    });
                }
            }

            // Is someone still alive?
            const livingEnimies = this.enemies.filter(enemy => enemy.isAlive);

            if (livingEnimies.length === 0) {
                this.lose = false;
                break;
            }

            // Can any of the enemies reach the tower on this turn?
            const killers =
                livingEnimies.filter(enemy => enemy.turnsToReachTheTower <= numOfTurn);
            if (killers.length > 0) {
                this.lose = true;
                break;
            }
        }
    }

};