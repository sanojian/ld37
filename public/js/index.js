
var GameState = function(game) {
};



window.onload = function() {

	var Boot = function(game) {};
	Boot.prototype = {
		preload: function() {

			this.load.image("background", "assets/gfx/background.png");


			//this.load.image('splashBackground', 'assets/gfx/Background.png');

		},
		create: function() {

			this.game.stage.smoothed = false;
			this.scale.minWidth = g_game.baseWidth;
			this.scale.minHeight = g_game.baseHeight;
			this.scale.maxWidth = g_game.baseWidth * g_game.scale;
			this.scale.maxHeight = g_game.baseHeight * g_game.scale;
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			//this.scale.setScreenSize(true);

			// catch right click mouse
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

			this.state.start('Splash');
		}
	};

	var width = navigator.isCocoonJS ? window.innerWidth : g_game.baseWidth;
	var height = navigator.isCocoonJS ? window.innerHeight : g_game.baseHeight;

	//g_game.phaserGame = new Phaser.Game(g_game.baseWidth, (g_game.baseWidth / g_game.gameWidth) * g_game.gameHeight, Phaser.AUTO, 'game', null, false, false);
	//                                  width, height, renderer,        parent,     state,      transparent,    antialias, physicsConfig
	g_game.phaserGame = new Phaser.Game(width, height, Phaser.CANVAS,   '',     null,       false,          false);
	//g_game.phaserGame = new Phaser.Game(g_game.baseWidth, g_game.baseHeight, Phaser.AUTO,   '',     null,       false,          false);
	g_game.phaserGame.state.add('Boot', Boot);
	g_game.phaserGame.state.add('Splash', SplashScreen);
	g_game.phaserGame.state.add('game', GameState);
	g_game.phaserGame.state.start('Boot');

};


window.g_game = {
	sounds: {},
	gameWidth: window.innerWidth * window.devicePixelRatio,
	gameHeight: window.innerHeight * window.devicePixelRatio,
	//baseWidth: 480,
	//baseHeight: 320,
	//scale: 2,
	baseWidth: 300,
	baseHeight: 200,
	scale: 3,
	masterVolume: 0,//.3,
	gravity: 200,      // pixels/second/second
	sfx: {},
	vacuumSpeed: 200,
	score: 0,
	misses: 0,
	currentClub: 'wood',
	textColor: 0xD04648,
	excuses: [
		'The sun was in\n   my eyes.',
		'Wait, these are\n not my clubs.',
		'Why does this\nwind keep changing?'
	]
};

GameState.prototype.create = function() {

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.gravity.y = 400;

  this.game.add.image(0, 0, 'background');

  g_game.vacuum = this.game.add.sprite(100, 100, 'assets', 'vacuum');
  g_game.vacuum.anchor.setTo(0.5);
  this.game.physics.p2.enable(g_game.vacuum);
  g_game.vacuum.body.collideWorldBounds = true;
  g_game.vacuum.body.data.gravityScale = 0;
  g_game.vacuum.body.mass = 100;

  g_game.furniture = this.game.add.group();
  var table = this.game.add.sprite(200, 100, 'assets', 'table');
  table.anchor.setTo(0.5);
  this.game.physics.p2.enable(table);
  table.body.collideWorldBounds = true;
  table.body.data.gravityScale = 0;
  table.body.mass = 1000;
  g_game.furniture.add(table);

  g_game.fragiles = this.game.add.group();
  var lamp = this.game.add.sprite(table.x, table.y - table.width/2 - 4, 'assets', 'lamp');
  lamp.anchor.setTo(0.5);
  this.game.physics.p2.enable(lamp);
  lamp.body.collideWorldBounds = true;
  lamp.body.mass = 0.01;
  g_game.fragiles.add(lamp);

  g_game.dirt = this.game.add.group();

  for (var i=0; i<100; i++) {
    var x = 12 + Math.random() * (this.game.width - 24);
    var y = 64 + Math.random() * (this.game.height - 64 - 12);
    var dirt = this.game.add.sprite(x, y, 'assets', 'dirt');
    dirt.anchor.setTo(0.5);
    this.game.physics.p2.enable(dirt);
    dirt.body.data.gravityScale = 0;
    dirt.body.data.shapes[0].sensor = true;
    dirt.body.onBeginContact.add(contactDirt, dirt);
    g_game.dirt.add(dirt);
  }

  g_game.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
  g_game.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  g_game.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  g_game.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

};

function contactDirt(target) {
  if (target.sprite === g_game.vacuum) {
    this.destroy();
  }

}

GameState.prototype.update = function() {

  if (g_game.dirt.length === 0) {
    console.log('win');
    return;
  }

  //this.game.physics.p2.collide(g_game.vacuum, g_game.dirt, vacuumDirt);
//  this.game.physics.p2.collide(g_game.vacuum, g_game.furniture, hitFurniture);
  //this.game.physics.p2.collide(g_game.furniture, g_game.fragiles);

  if (g_game.upKey.isDown) {
    g_game.vacuum.body.velocity.x = 0;
    g_game.vacuum.body.velocity.y = -g_game.vacuumSpeed;
  }
  else if (g_game.downKey.isDown) {
    g_game.vacuum.body.velocity.x = 0;
    g_game.vacuum.body.velocity.y = g_game.vacuumSpeed;
  }

  if (g_game.leftKey.isDown) {
    g_game.vacuum.body.velocity.x = -g_game.vacuumSpeed;
    g_game.vacuum.body.velocity.y = 0;
  }
  else if (g_game.rightKey.isDown) {
    g_game.vacuum.body.velocity.x = g_game.vacuumSpeed;
    g_game.vacuum.body.velocity.y = 0;
  }

  //g_game.vacuum.x += g_game.vacuum.customProps.speed * g_game.vacuum.customProps.dirX;
  //g_game.vacuum.y += g_game.vacuum.customProps.speed * g_game.vacuum.customProps.dirY;
  g_game.vacuum.y = Math.max(g_game.vacuum.y, 64);
};

function vacuumDirt(vacuum, dirt) {
  dirt.destroy();
}

function hitFurniture(vacuum, furniture) {
  furniture.x += g_game.vacuum.customProps.speed * g_game.vacuum.customProps.dirX;
  furniture.y += g_game.vacuum.customProps.speed * g_game.vacuum.customProps.dirY;
  furniture.y = Math.max(furniture.y, 64);
}


var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');

		this.load.atlasJSONHash('assets', 'assets/gfx/sprites.png', null, g_game.spriteAtlas.assets);
		//this.load.atlasJSONHash('ui', 'assets/gfx/ui.png', null, g_game.spriteAtlas.ui);
		//this.load.bitmapFont('pressStart2p', 'assets/fonts/pressStart2p_0.png', 'assets/fonts/pressStart2p.xml');

		//this.game.load.audio('drive', ['assets/audio/sfx/drive.wav']);

		//this.game.load.audio('squiggy', ['https://dl.dropboxusercontent.com/u/102070389/ld32/squiggy.OGG']);

	},
	create: function() {
		var back = this.game.add.image(0, 0, 'background');
		back.inputEnabled = true;
		back.events.onInputDown.add(function() {
			this.game.state.start('game');
      console.log('starting game...');
		}, back);


  }
};


g_game.spriteAtlas = {};

g_game.spriteAtlas.assets = {
	frames: {
    dirt: { frame: { x: 0, y: 0, w: 4, h: 4 } },
    vacuum: { frame: { x: 0, y: 4, w: 16, h: 16 } },
    table: { frame: { x: 0, y: 20, w: 24, h: 24 } },
    lamp: { frame: { x: 0, y: 44, w: 4, h: 8 } },
	}
};

g_game.spriteAtlas.ui = {
	frames: {
		button_wood: { frame: { x: 0, y: 0, w: 32, h: 32 } },
		button_wood1: { frame: { x: 32, y: 0, w: 32, h: 32 } },
		button_iron: { frame: { x: 0, y: 64, w: 32, h: 32 } },
		button_iron1: { frame: { x: 32, y: 64, w: 32, h: 32 } },
		button_wedge: { frame: { x: 0, y: 32, w: 32, h: 32 } },
		button_wedge1: { frame: { x: 32, y: 32, w: 32, h: 32 } }
	}
};
