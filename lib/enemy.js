'use strict';

module.exports = class Enemy {
    constructor(params) {
        this.name = params.e_name;
        this.startDistance = params.e_dist;
        this.speed = params.e_speed;

        // The number of turns which need the enemy to get to the tower.
        this.turnsToReachTheTower = Math.ceil(this.startDistance / this.speed );
    }

    // Positioning, as well as saving the last position of the enemy before it reached the battle area
    positioning(turnNumber, firingRange) {

        // reset on the first (0th) turn to reuse this component
        if (turnNumber === 0) {
            this.isLastPositionValid = false;
            this.isInBattle = true; // to prevent saving of previous position on the first turn
            this.isAlive = true;
        }

        const prevDistance = this.currentDistance;
        this.currentDistance = this.startDistance - this.speed * turnNumber;

        const wasInBattle = this.isInBattle;
        this._isInBattle(firingRange);

        if (this.isInBattle && !wasInBattle) {
            this.nextTryFiringRange = prevDistance;
            this.isLastPositionValid = true;
        }
    }

    // Is this enemy entry into the battle area (into the tower's firing range)?
    // This method is "private" - for internal using only
    _isInBattle(firingRange) {
        this.isInBattle = this.currentDistance <= firingRange;
    }
};
