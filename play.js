var playState = {

	preload: function() {
		game.load.image('background', 'assets/background.png');
		game.load.spritesheet('shadow_pigeon', 'assets/pigeons-shadows.png', 66, 50);
		game.load.spritesheet('next_button', 'assets/next-button.png', 105, 76);
		game.load.spritesheet('pigeon_booth', 'assets/pigeon-booth.png', 122, 121);
		game.load.image('passport', 'assets/passport.png');
		game.load.spritesheet('stamps', 'assets/stamps.png', 561, 150);
	},

	create: function() {

		// GAME BACKGROUND
		game.add.sprite(0, 0, 'background');

		// SHADOW PIGEONS
		// creating group of pigeons
		pigeons = game.add.group();
		var pigeon = [];
		// here we'll create 12 of them evenly spaced apart
		for (var i = 0; i < 10; i++) {
			//  Create a pigeon sprite inside of the 'pigeons' group
			pigeon[i] = pigeons.create(i*20, 20, 'shadow_pigeon');
			//  Our two animations, walking left and right.
			pigeon[i].animations.add('flying', [1, 2]);
		}

		// NEXT BUTTON
		next_button = game.add.sprite(100, 400, 'next_button');
		next_button.animations.add('blink', [1, 2]);
		next_button.play('blink', 4, true);
		next_button.inputEnabled = true;
		next_button.events.onInputDown.add(nextPigeon);

		// STAMP
		stamp = game.add.sprite(game.world.width-50, 200, 'stamps');
		stamp.inputEnabled = true;
		stamp.events.onInputDown.add(showStamp, this);
		function showStamp() {
			console.log("show stamp");
			stamp_show_tween = game.add.tween(stamp).to( { x: 439 }, 2000, "Quart.easeOut");
			stamp_show_tween.start();
			stamp.events.onInputDown.removeAll();
			stamp.events.onInputDown.add(hideStamp, this);
		}
		function hideStamp() {
			console.log("hide stamp");
			stamp_hide_tween = game.add.tween(stamp).to( { x: game.world.width-50 }, 2000, "Quart.easeOut");
			stamp_hide_tween.start();
			stamp.events.onInputDown.removeAll();
			stamp.events.onInputDown.add(showStamp, this);
		}
		
		function nextPigeon() {

			console.log("pigeon suivant");

			// remove clickable state of next button
			next_button.events.onInputDown.removeAll();
			next_button.animations.stop(null, true);
			next_button.frame = 0;

			// PUT PIGEON IN BOOTH
			pigeon_booth = game.add.sprite(0, 249, 'pigeon_booth');
			pigeon_booth_tween = game.add.tween(pigeon_booth).to({x: 100, y: 249}, 1000, "Quart.easeOut");
			pigeon_booth_tween.start();
			pigeon_booth_tween.onComplete.add(passport);

			// STAMPING
			// TO DO
			//
			//

			// STAMPED IS DONE
			pigeon_booth_tween.onComplete.add(accepted);

			function accepted() {
				pigeon_booth.frame = 1;
				//pigeon_booth.play('mad');
				// pigeon flying
				var flying_pigeon = game.add.sprite(30, 30, 'shadow_pigeon');
				flying_pigeon.animations.add('flying', [1, 2]);
				flying_pigeon.enableBody = true;
				//flying_pigeon_tween = game.add.tween(flying_pigeon).to({x: 1000, y: 30}, 3000, "Quart.easeOut");
				flying_pigeon.play('flying', 10, true);
				//flying_pigeon.body.velocity.x = 200;
				//game.physics.arcade.moveToXY(flying_pigeon, 126, 160, 200);
				//flying_pigeon_tween.start();

			}

			function passport() {
				// PASSPORT
				passport = game.add.sprite(200, 350, 'passport');
				passport_tween = game.add.tween(passport).to({x: 350, y: 350}, 1000, "Quart.easeOut");
				passport_tween.start();
				// Enable input and allow for dragging of passport
				passport.inputEnabled = true;
				passport.input.enableDrag();
				passport.events.onDragStart.add(onDragStart, this);
				passport.events.onDragStop.add(onDragStop, this);
				game.input.mouse.capture = true;
				function onDown(sprite, pointer) {
					result = "Down " + sprite.key;
					console.log('down', sprite.key);
				}
				function onDragStart(sprite, pointer) {
					//result = "Dragging " + sprite.key;
				}
				function onDragStop(sprite, pointer) {
					if (pointer.y > 600) {
						console.log('input disabled on', sprite.key);
						sprite.input.enabled = false;
						sprite.sendToBack();
					}
				}
			}

		}
	},


//	update: function(){
//
//	},

}