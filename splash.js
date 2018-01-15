var splashState = {

	preload: function() {
		game.load.image('title', 'assets/phaser.png');
	},

	create: function() {

		// WELCOME PAGE
		var title = game.add.image(309, 100, 'title');
		var text;
		var style = { font: "16px Arial", fill: "#ff0044", align: "center" };
		text = game.add.text(309,500, "Cliquez sur le bouton gauche de la souris pour commencer", style);
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