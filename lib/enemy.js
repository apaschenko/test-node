'use strict';

module.exports = class Enemy {
    constructor(enemyParams, firingRange) {
        this.name = enemyParams.name;
        this.startDistance = enemyParams.distance;
        this.speed = enemyParams.speed;
        this.turnsToReachTower = Math.ceil( this.startDistance / this.speed );
        this.respawn(firingRange);
    }

    // Positioning, as well as saving the last position of the enemy before it reached the battle area
    reposition(firingRange) {
        const prevDistance = this.currentDistance;
        const wasInBattle = this.isInBattle;

        this.currentDistance -= this.speed;
        this.isReachedTower = this.currentDistance <= 0;
        this.isInBattle = this.currentDistance <= firingRange;

        if ( this.isInBattle && !wasInBattle )  {
            this.positionBeforeBattle = prevDistance;
        }
    }

    // reset before first (0th) turn to reuse this component in the next round
    respawn(firingRange) {
        this.currentDistance = this.startDistance;
        this.isReachedTower = false;
        this.isInBattle = this.currentDistance <= firingRange;
        this.isAlive = true;
        this.positionBeforeBattle = Infinity;
    }

    kill() {
        this.isAlive = false;
    }
};
