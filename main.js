var game = new Phaser.Game(1000, 560, Phaser.AUTO, 'gameDiv');
game.state.add('splash', splashState);
game.state.add('play', playState);
game.state.start('splash');