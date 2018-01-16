var playState = {

	preload: function() {
		game.load.image('background', 'graphics/background.png');
		game.load.spritesheet('shadow_pigeon', 'graphics/pigeons-shadows.png', 66, 50);
		game.load.spritesheet('next_button', 'graphics/next-button.png', 105, 76);
		game.load.spritesheet('pigeon_booth', 'graphics/pigeon-booth.png', 122, 121);
		game.load.spritesheet('passport', 'graphics/passport.png', 481, 322);
		game.load.spritesheet('stamp', 'graphics/stamps.png', 561, 150);
		game.load.audio('stamp_audio', 'sounds/stamp.mp3');
		game.load.audio('paper_audio', 'sounds/paper.mp3');
		game.load.audio('flying_audio', 'sounds/flying.mp3');
	},

	create: function() {

		// GAME BACKGROUND
		game.add.sprite(0, 0, 'background');

		// SHADOW PIGEONS
		// creating group of pigeons
		pigeons = game.add.group();
		var pigeon = [];
		// here we'll create 12 of them evenly spaced apart
		for (var i = 0; i < 9; i++) {
			//  Create a pigeon sprite inside of the 'pigeons' group
			var random_nb = Math.floor((Math.random() * 16) - 8);
			pigeon[i] = pigeons.create(i*20-10, 45+random_nb, 'shadow_pigeon');
			pigeon[i].animations.add('flying', [1, 2]);
		}

		// NEXT BUTTON
		next_button = game.add.sprite(100, 400, 'next_button');
		next_button.animations.add('blink', [1, 2]);

		// STAMP
		stamp = game.add.sprite(game.world.width-50, 200, 'stamp');
		stamp.animations.add('green_action', [2, 0]);
		stamp.animations.add('red_action', [1, 0]);
		stamp.inputEnabled = true;
		stamp.events.onInputDown.add(showStamp, this);
		var stamp_audio = game.add.audio('stamp_audio');

		// PASSPORT AUDIO
		var paper_audio = game.add.audio('paper_audio');

		// FLYING AUDIO
		var flying_audio = game.add.audio('flying_audio');

		function showStamp() {
			stamp_show_tween = game.add.tween(stamp).to( { x: 439 }, 1000, "Quart.easeOut");
			stamp_show_tween.start();
			stamp.events.onInputDown.removeAll();
			stamp.events.onInputDown.add(onStampClick, this);
			function onStampClick() {
				var hide_stamp_area = new Phaser.Rectangle(441,238,23,116);
				var red_stamp_area = new Phaser.Rectangle(511,214,159,113);
				var green_stamp_area = new Phaser.Rectangle(730,214,159,113);
				var x = game.input.activePointer.positionDown.x;
				var y = game.input.activePointer.positionDown.y;
				// console.log(x,y); // TEST
				if (red_stamp_area.contains(x, y)) {
					stamp.play('red_action', 5, false);
					stamp_audio.play();
					if (typeof passport !== "undefined") {
						passport.frame = 2;
						accepted();
					}
				}
				else if (green_stamp_area.contains(x, y)) {
					stamp.play('green_action', 5, false);
					stamp_audio.play();
					if (typeof passport !== "undefined") {
						passport.frame = 1;
						//game.time.events.add(Phaser.Timer.SECOND * 1, accepted, this);
						accepted();
					}
				}
				else if (hide_stamp_area.contains(x, y)) {
					hideStamp();
				}
			}
		}

		function hideStamp() {
			stamp_hide_tween = game.add.tween(stamp).to( { x: game.world.width-50 }, 1000, "Quart.easeOut");
			stamp_hide_tween.start();
			stamp.events.onInputDown.removeAll();
			stamp.events.onInputDown.add(showStamp, this);
		}


		function accepted() {
			hideStamp();
			var fadeout_pigeon_booth_tween = game.add.tween(pigeon_booth).to( { alpha: 0 }, 300);
			fadeout_pigeon_booth_tween.onComplete.add(changePigeonBooth);
			fadeout_pigeon_booth_tween.start();
			function changePigeonBooth() {
				pigeon_booth.frame = 1;
				var fadein_pigeon_booth_tween = game.add.tween(pigeon_booth).to( { alpha: 1 }, 300);
				fadein_pigeon_booth_tween.onComplete.add(function(){
					game.time.events.add(Phaser.Timer.SECOND * 1, pigeonDone, this); // wait for one second
					function pigeonDone(){
						// REMOVE PASSPORT
						remove_passport_tween = game.add.tween(passport).to({x: 400, y: 600}, 1000, "Quart.easeOut");
						paper_audio.play();
						remove_passport_tween.start();
						remove_passport_tween.onComplete.add(function(){
							passport.destroy();
						});
						// REMOVE PIGEON FROM BOOTH
						remove_pigeon_booth_tween = game.add.tween(pigeon_booth).to({x: -500, y: 300}, 1000, "Quart.easeOut");
						remove_pigeon_booth_tween.start();
						remove_pigeon_booth_tween.onComplete.add(function(){
							// DESTROY PIGEON BOOTH
							pigeon_booth.destroy();
							// PIGEON FLYING
							var flying_pigeon = game.add.sprite(90, 45, 'shadow_pigeon');
							flying_pigeon.animations.add('flying', [1, 2]);
							flying_audio.play();
							var flying_pigeon_tween = game.add.tween(flying_pigeon).to( { x: 1000 }, 2000, 'Linear');
							flying_pigeon.play('flying', 10, true);
							flying_pigeon_tween.start();
							flying_pigeon_tween.onComplete.add(function(){
								flying_pigeon.destroy();
								loop();
							});
						});
					};
				});
				fadein_pigeon_booth_tween.start();
			}
		}

		function loop() {

			next_button.play('blink', 4, true);
			next_button.inputEnabled = true;
			next_button.events.onInputDown.add(function(){

				// NEXT PIGEON
				// remove clickable state of next button
				next_button.events.onInputDown.removeAll();
				next_button.animations.stop(null, true);
				next_button.frame = 0;

				// PUT PIGEON IN BOOTH
				pigeon_booth = game.add.sprite(0, 249, 'pigeon_booth');
				pigeon_booth_tween = game.add.tween(pigeon_booth).to({x: 100, y: 249}, 1000, "Quart.easeOut");
				pigeon_booth_tween.start();

				// BRING PASSPORT
				pigeon_booth_tween.onComplete.add(bringPassport);
				function bringPassport() {
					passport = game.add.sprite(0, 300, 'passport');
					game.world.bringToTop(stamp); // stamps must stay on top
					passport_tween = game.add.tween(passport).to({x: 400, y: 200}, 1000, "Quart.easeOut");
					paper_audio.play();
					passport_tween.start();

					// Enable input and allow for dragging of passport
					passport.inputEnabled = true;
					passport.input.enableDrag();
					passport.events.onDragStart.add(onDragStart, this);
					passport.events.onDragStop.add(onDragStop, this);
					game.input.mouse.capture = true;
					function onDragStart(sprite, pointer) {
						//result = "Dragging " + sprite.key;
					}
					function onDragStop(sprite, pointer) {
						if (pointer.y > 600) {
							sprite.input.enabled = false;
							sprite.sendToBack();
						}
					}
				}
			});
		};

	loop();

	},

}