
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
	baseWidth: 240,
	baseHeight: 160,
	scale: 10,
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


g_game.rooms = {
	1: {
		vacuum: { x: 20, y: 150},
		furniture: [
			{ sprite: 'table', x: 200, y: 100 },
      { sprite: 'sofa', x: 120, y: 120 }
		],
    fragiles: [
			{ sprite: 'lamp', x: 200, y: 80 }
		],
		music: 'squiggy'
	}
};

GameState.prototype.create = function() {

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.gravity.y = 400;

  this.game.add.image(0, 0, 'background');


  var wall = this.game.add.sprite(0,0);
  this.game.physics.p2.enable(wall);
  wall.anchor.setTo(0);
  wall.body.setRectangle(g_game.baseWidth, 40, g_game.baseWidth/2, 40/2);
  wall.body.static = true;
  wall.body.debug = false;

  var level = g_game.rooms[1];

  g_game.vacuum = this.game.add.sprite(100, 100, 'assets', 'vacuum');
  g_game.vacuum.anchor.setTo(0.5);
  this.game.physics.p2.enable(g_game.vacuum);
  g_game.vacuum.body.setCircle(g_game.vacuum.width/2);
  g_game.vacuum.body.collideWorldBounds = true;
  g_game.vacuum.body.angularDamping = 1;
  g_game.vacuum.body.data.gravityScale = 0;
  g_game.vacuum.body.mass = 100;

  g_game.dirt = this.game.add.group();

  var i;
  for (i=0; i<100; i++) {
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

  g_game.furniture = this.game.add.group();
  for (i=0; i<level.furniture.length; i++) {
    var furniture = this.game.add.sprite(level.furniture[i].x, level.furniture[i].y, 'assets', level.furniture[i].sprite);
    furniture.anchor.setTo(0.5);
    this.game.physics.p2.enable(furniture);
    furniture.body.clearShapes();
    furniture.body.addRectangle(furniture.width, 5*furniture.height/6, 0, furniture.height/12);
    furniture.body.debug = false;
    furniture.body.collideWorldBounds = true;
    furniture.body.data.gravityScale = 0;
    furniture.body.damping = 0.9;
    furniture.body.angularDamping = 1;
    furniture.body.mass = 1000;
    g_game.furniture.add(furniture);

  }

  g_game.fragiles = this.game.add.group();
  for (i=0; i<level.fragiles.length; i++) {
    var fragile = this.game.add.sprite(level.fragiles[i].x, level.fragiles[i].y, 'assets', level.fragiles[i].sprite);
    fragile.anchor.setTo(0.5);
    this.game.physics.p2.enable(fragile);
    fragile.body.collideWorldBounds = true;
    fragile.body.clearShapes();
    fragile.body.addPolygon({}, [
      [0, 0],
      [fragile.width, 0],
      [fragile.width, fragile.height/4],
      [3*fragile.width/4, fragile.height/4],
      [3*fragile.width/4, fragile.height],
      [fragile.width/4, fragile.height],
      [fragile.width/4, fragile.height/4],
      [0, fragile.height/4]
    ]);
    fragile.body.debug = false;
    fragile.body.mass = 0.01;
    fragile.customProps = {};
    fragile.customProps.oy = fragile.y;
    g_game.fragiles.add(fragile);
  }
  /*var lamp = this.game.add.sprite(table.x, table.y - table.width/2, 'assets', 'lamp');
  lamp.anchor.setTo(0.5);
  this.game.physics.p2.enable(lamp);
  lamp.body.collideWorldBounds = true;
  lamp.body.clearShapes();
  lamp.body.addPolygon({}, [
    [0, 0],
    [lamp.width, 0],
    [lamp.width, lamp.height/4],
    [3*lamp.width/4, lamp.height/4],
    [3*lamp.width/4, lamp.height],
    [lamp.width/4, lamp.height],
    [lamp.width/4, lamp.height/4],
    [0, lamp.height/4]
  ]);
  lamp.body.debug = false;

  lamp.body.mass = 0.01;
  lamp.customProps = {};
  lamp.customProps.oy = lamp.y;
  g_game.fragiles.add(lamp);*/


  g_game.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
  g_game.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  g_game.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  g_game.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

};

function contactDirt(target) {
  //if (target.sprite === g_game.vacuum) {
    this.destroy();
  //}

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
    g_game.vacuum.scale.x = -1;
  }
  else if (g_game.rightKey.isDown) {
    g_game.vacuum.body.velocity.x = g_game.vacuumSpeed;
    g_game.vacuum.body.velocity.y = 0;
    g_game.vacuum.scale.x = 1;
  }

  g_game.fragiles.forEach(function(fragile) {
    if (fragile.y - fragile.customProps.oy > 16) {
      fragile.body.data.gravityScale = 0;
      fragile.body.velocity.x = 0;
      fragile.body.velocity.y = 0;
      fragile.body.angularVelocity = 0;
    }
  });

  //g_game.vacuum.x += g_game.vacuum.customProps.speed * g_game.vacuum.customProps.dirX;
  //g_game.vacuum.y += g_game.vacuum.customProps.speed * g_game.vacuum.customProps.dirY;
  //g_game.vacuum.body.y = Math.max(g_game.vacuum.body.y, 64);
  //g_game.vacuum.body.angle = 0;
};


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
    table: { frame: { x: 0, y: 20, w: 24, h: 20 } },
    sofa: { frame: { x: 24, y: 20, w: 48, h: 20 } },
    lamp: { frame: { x: 0, y: 40, w: 8, h: 8 } },
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
