'use strict';

const Enemy = require('./enemy');
const Tower = require('./tower');

const gameStatuses = {
    WIN: "WIN",
    LOSE: "LOSE"
};

module.exports = class Game {
    constructor(data) {
        this.tower = new Tower(data.firingRange);

        this.startFiringRange = data.firingRange;

        this.enemies = data.enemies.reduce((enemies, enemyData) => {
            enemies.push(new Enemy(enemyData, data.firingRange));
            return enemies;
        }, []);

        this.results = {
            firstRoundHistory: [],
            firingRange: data.firingRange
        };
    }

    play() {
        for (let roundNumber = 0 ;; roundNumber++ ) {
            this.playRound(roundNumber);

            if (this.gameStatus === gameStatuses.WIN ) {
                this.results.minFiringRangeForWin = this.tower.firingRange;
                break;
            }

            const newFiringRange = this.calculateNewFiringRange();


            if ( (newFiringRange <= this.tower.firingRange) || (newFiringRange === Infinity) ) {
                this.results.minFiringRangeForWin = 'Infinity';
                break;
            }

            this.tower.setFiringRange(newFiringRange);
        }
    }

    playRound(roundNumber) {

        const isFirstRound = roundNumber === 0;

        this.enemies.forEach(enemy => enemy.respawn(this.tower.firingRange));

        for (let turnNumber = 1 ;; turnNumber++) {
            // shot simulating
            const killedEnemy = this.tower.takeAShot( this.enemies );

            if (isFirstRound && killedEnemy) {
                this.results.firstRoundHistory.push({
                    turn: turnNumber,
                    name: killedEnemy.name,
                    distance: killedEnemy.currentDistance
                });
            }

            // Is someone still alive?
            const livingEnemies = this.enemies.filter(enemy => enemy.isAlive);

            if (livingEnemies.length === 0) {
                this.gameStatus = gameStatuses.WIN; // the tower won!
                if (isFirstRound) {
                    this.results.turns = turnNumber;
                    this.results.firstRoundStatus = gameStatuses.WIN;
                }
                break;
            }

            // Enemies are moving
            this.enemies.forEach(enemy => { enemy.reposition(this.tower.firingRange); });

            // Did any of the enemies reach the tower?
            const killers =
                livingEnemies.filter( enemy => enemy.isReachedTower );
            if (killers.length > 0) {
                this.gameStatus = gameStatuses.LOSE; // the tower lost
                if (isFirstRound) {
                    this.results.turns = turnNumber;
                    this.results.firstRoundStatus = gameStatuses.LOSE;
                }
                break;
            }
        }
    }

    // If the tower has lost, we need calculate the new minNode range of fire in which some
    // enemies can be killed one turn earlier.
    calculateNewFiringRange () {
        const positionsBeforeBattle = this.enemies.map ( enemy => enemy.positionBeforeBattle );
        return Math.min( ...positionsBeforeBattle );
    }
};