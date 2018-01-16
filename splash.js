var splashState = {

	preload: function() {
		game.load.image('title', 'graphics/title.png');
	},

	create: function() {

		// WELCOME PAGE
		var title = game.add.image(283, 150, 'title');
		var style = { font: "16px Courier", fill: "#ff0044", align: "center" };
		var style2 = { font: "12px Courier", fill: "#ff0044", align: "center" };
		var text1 = game.add.text(110, 350, "Décidez du sort de ces pigeons qui, de toutes façons, n'en feront qu'à leur tête", style);		
		var text2 = game.add.text(380, 450, "Le jeu se joue uniquement à la souris", style2);
		var text3 = game.add.text(290, 480, "Cliquez sur le bouton gauche de la souris pour commencer", style2);
		//text.anchor.set(0.9);

		// CALLING THE PLAY STATE WHEN PUSHING A KEY ON KEYBOARD
		game.input.mouse.capture = true;

	},

	update: function() {
		if (game.input.activePointer.leftButton.isDown) {
			game.state.start('play', Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
		}
	}

};