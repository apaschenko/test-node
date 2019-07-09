'use strict'

module.exports = class Tower {
    constructor(firingRange) {
        this.setFiringRange(firingRange);
    }

    setFiringRange(firingRange) {
        this.firingRange = firingRange;
    }

    // shot simulating
    takeAShot(enemies) {
        let target  = null;

        const enemiesInBattleArea = enemies.filter(enemy =>
            enemy.isAlive && enemy.isInBattle
        );

        // the tower kills an available enemy who can reach the tower first
        if (enemiesInBattleArea.length > 0) {
            enemiesInBattleArea.sort((a, b) => a.turnsToReachTower - b.turnsToReachTower);
            target = enemiesInBattleArea[0];
            target.kill();
        }

        return target;
    }
};
