'use strict';

const Game = require('./game');

module.exports = (data) => {
    const game = new Game(data);
    game.play();

    return game.results;
};