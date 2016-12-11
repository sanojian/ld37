
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
  currentLevel: 3,
  maxLevel: 4,
	sfx: {},
	vacuumSpeed: 200
};


g_game.rooms = {
	1: {
		vacuum: { x: 100, y: 100},
    time: 15,
		furniture: [
      { sprite: 'sofa', x: 180, y: 60 }
		],
    fragiles: [
		],
    dirt: 10,
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'}
    ],
    winMessages: [
      { headLine: 'Party Success!', sub: 'Good time\nby everyone'}
    ],
    titles: [
      { headLine: 'Party at Three', sub: 'Some doofus\nhaving party'},
      { headLine: 'Party at Three', sub: 'Slow year\nin news'}
    ],
		music: 'squiggy'
	},
  2: {
    vacuum: { x: 100, y: 100},
    time: 20,
    dirt: 100,
    furniture: [
      { sprite: 'table', x: 200, y: 100 },
      { sprite: 'sofa', x: 120, y: 120 }
    ],
    fragiles: [
      { sprite: 'lamp', x: 190, y: 80 }
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'},
      { headLine: 'Party a Failure', sub: 'House\ncondemned'}
    ],
    winMessages: [
      { headLine: 'Party Success!', sub: 'Good time\nby everyone'}
    ],
    titles: [
      { headLine: 'Big Party 3pm', sub: 'Neighborhood\nexcited'},
      { headLine: 'Big Party 3pm', sub: 'Not sure why\nthis is news'}
    ],
    music: 'squiggy'
  },
  4: {
    vacuum: { x: 180, y: 60},
    time: 20,
    dirt: 200,
    furniture: [
      { sprite: 'table', x: 40, y: 80 },
      { sprite: 'table', x: 40, y: 120 },
      { sprite: 'sofa', x: 90, y: 100 }
    ],
    fragiles: [
      { sprite: 'lamp', x: 30, y: 60 },
      { sprite: 'statue', x: 38, y: 60 },
      { sprite: 'lamp', x: 34, y: 100 }
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'},
      { headLine: 'Party a Failure', sub: 'House\ncondemned'}
    ],
    winMessages: [
      { headLine: 'Game won!', sub: 'Sorry no\nwin screen'}
    ],
    titles: [
      { headLine: 'Grand Gala at 3', sub: 'President\ninvited'},
      { headLine: 'Grand Gala at 3', sub: 'Could be the\nevent of year'}
    ],
    music: 'squiggy'
  },
  3: {
    vacuum: { x: 180, y: 60},
    time: 15,
    dirt: 200,
    furniture: [
      { sprite: 'sofa', x: 34, y: 100 },
      { sprite: 'sofa', x: 90, y: 100 },
      { sprite: 'sofa', x: 144, y: 100 },
      { sprite: 'sofa', x: 194, y: 100 }
    ],
    fragiles: [
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'},
      { headLine: 'Party a Failure', sub: 'House\ncondemned'}
    ],
    winMessages: [
      { headLine: 'Clean party!', sub: 'Nobody looked\nunder sofa'}
    ],
    titles: [
      { headLine: '3pm Block party', sub: 'Neighborhood\nexcited'},
      { headLine: '3pm Block party', sub: 'Could be a\nbig event'}
    ],
    music: 'squiggy'
  }
};

GameState.prototype.create = function() {

  g_game.gameOver = false;
  g_game.lost = false;
  g_game.won = false;
  var level = g_game.rooms[g_game.currentLevel];

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.gravity.y = 400;

  g_game.sfx.tick = this.game.add.audio('tick');
  g_game.sfx.explosion = this.game.add.audio('explosion');
  g_game.sfx.vacuum = this.game.add.audio('vacuum');
  g_game.sfx.vacuum.loop = true;
  g_game.sfx.vacuum.play();

  this.game.add.image(0, 0, 'background');

  g_game.dirt = this.game.add.group();

  var playerGroup = g_game.playerGroup = this.game.physics.p2.createCollisionGroup();
  var furnitureGroup = g_game.furnitureGroup = this.game.physics.p2.createCollisionGroup();
  var fragileGroup = g_game.fragileGroup = this.game.physics.p2.createCollisionGroup();
  var wallGroup = g_game.wallGroup = this.game.physics.p2.createCollisionGroup();
  var dirtGroup = g_game.dirtGroup = this.game.physics.p2.createCollisionGroup();

  var wall = this.game.add.sprite(0,0);
  this.game.physics.p2.enable(wall);
  wall.anchor.setTo(0);
  wall.body.setRectangle(g_game.baseWidth, 40, g_game.baseWidth/2, 40/2);
  wall.body.static = true;
  wall.body.debug = false;
  wall.body.setCollisionGroup(wallGroup);
  wall.body.collides([furnitureGroup, fragileGroup, playerGroup]);

  wall = this.game.add.sprite(0,0);
  this.game.physics.p2.enable(wall);
  wall.anchor.setTo(0);
  wall.body.setRectangle(4, g_game.baseHeight, 4/2, g_game.baseHeight/2);
  wall.body.static = true;
  wall.body.debug = false;
  wall.body.setCollisionGroup(wallGroup);
  wall.body.collides([furnitureGroup, fragileGroup, playerGroup]);

  wall = this.game.add.sprite(0,0);
  this.game.physics.p2.enable(wall);
  wall.anchor.setTo(0);
  wall.body.setRectangle(4, g_game.baseHeight, g_game.baseWidth - 4/2, g_game.baseHeight/2);
  wall.body.static = true;
  wall.body.debug = false;
  wall.body.setCollisionGroup(wallGroup);
  wall.body.collides([furnitureGroup, fragileGroup, playerGroup]);

  wall = this.game.add.sprite(0,0);
  this.game.physics.p2.enable(wall);
  wall.anchor.setTo(0);
  wall.body.setRectangle(g_game.baseWidth, 4, g_game.baseWidth/2, g_game.baseHeight - 4/2);
  wall.body.static = true;
  wall.body.debug = false;
  wall.body.setCollisionGroup(wallGroup);
  wall.body.collides([furnitureGroup, fragileGroup, playerGroup]);

  var clock = this.game.add.image(160, 20, 'assets', 'clock');
  clock.anchor.setTo(0.5);
  g_game.secondHand = this.game.add.image(clock.x, clock.y, 'assets', 'secondHand');
  g_game.secondHand.anchor.setTo(0.5);
  var clockHands = this.game.add.image(clock.x, clock.y, 'assets', 'clockHands');
  clockHands.anchor.setTo(0.5);

  g_game.timeLeft = level.time + 1;
  drawClock();
  var timer1 = this.game.time.create(false);
  timer1.repeat(1000, g_game.timeLeft, drawClock, this);
  timer1.start();

  //g_game.vacuum = this.game.add.sprite(100, 100, 'assets', 'vacuum');
  g_game.vacuum = this.game.add.sprite(level.vacuum.x, level.vacuum.y, 'vacuumMove');
  g_game.vacuum.anchor.setTo(0.5);
  g_game.vacuum.animations.add('walk', [0, 1]);
  g_game.vacuum.animations.play('walk', 8, true);
  this.game.physics.p2.enable(g_game.vacuum);
  g_game.vacuum.body.setCircle(g_game.vacuum.width/2);
  g_game.vacuum.body.collideWorldBounds = true;
  g_game.vacuum.body.angularDamping = 1;
  g_game.vacuum.body.data.gravityScale = 0;
  g_game.vacuum.body.mass = 100;
  g_game.vacuum.body.setCollisionGroup(playerGroup);
  g_game.vacuum.body.collides([furnitureGroup, fragileGroup, wallGroup, dirtGroup]);

  var i;
  for (i=0; i<level.dirt; i++) {
    var x = 12 + Math.random() * (this.game.width - 24);
    var y = 64 + Math.random() * (this.game.height - 64 - 12);
    var dirt = this.game.add.sprite(x, y, 'assets', 'dirt');
    dirt.anchor.setTo(0.5);
    this.game.physics.p2.enable(dirt);
    dirt.body.data.gravityScale = 0;
    dirt.body.data.shapes[0].sensor = true;
    dirt.body.setCollisionGroup(dirtGroup);
    dirt.body.collides([playerGroup, furnitureGroup]);
    dirt.body.onBeginContact.add(contactDirt, dirt);
    g_game.dirt.add(dirt);
  }

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
    furniture.body.setCollisionGroup(furnitureGroup);
    furniture.body.collides([playerGroup, fragileGroup, wallGroup, dirtGroup, furnitureGroup]);
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
      [fragile.width, fragile.height/2],
      [5*fragile.width/8, fragile.height/2],
      [5*fragile.width/8, fragile.height],
      [3*fragile.width/8, fragile.height],
      [3*fragile.width/8, fragile.height/2],
      [0, fragile.height/2],
      [0, 0]
    ]);
    fragile.body.debug = false;
    fragile.body.setCollisionGroup(fragileGroup);
    fragile.body.collides([furnitureGroup, wallGroup]);
    fragile.body.mass = 0.01;
    fragile.customProps = {};
    fragile.customProps.oy = fragile.y;
    g_game.fragiles.add(fragile);
  }

  g_game.particleEmitter = this.game.add.emitter(0, 0, 100);
  g_game.particleEmitter.makeParticles('assets', 'particle');
  g_game.particleEmitter.gravity = 1;

  initNewspaper(this.game);

  g_game.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
  g_game.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  g_game.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  g_game.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  g_game.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

function contactDirt(target) {
  if (!g_game.gameOver) {
    g_game.sfx.tick.play();
    this.destroy();
  }
}

function drawClock() {
  if (g_game.gameOver) {
    return;
  }
  g_game.timeLeft--;
  var angle = 2 * Math.PI * g_game.timeLeft / 60;
  g_game.secondHand.rotation = -angle;

  if (g_game.timeLeft <=0) {
    // lost
    loseGame();
  }
}

GameState.prototype.update = function() {

  if (g_game.dirt.length === 0 && !g_game.gameOver) {
    winGame();
    return;
  }

  if (g_game.gameOver && g_game.spaceKey.isDown) {
    this.game.state.start('Splash');
  }
  else if (g_game.gameOver) {
  }
  else if (g_game.upKey.isDown) {
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
      // make collidable with player
      fragile.body.collides([g_game.furnitureGroup, g_game.wallGroup, g_game.playerGroup]);
      fragile.body.data.shapes[0].sensor = true;
      fragile.body.onBeginContact.add(runoverFragile, fragile);
    }
  });
};

function runoverFragile(target) {
  if (!g_game.gaveOver && target.sprite === g_game.vacuum) {
    g_game.gameOver = true;
    g_game.sfx.explosion.play();
    g_game.particleEmitter.x = this.x;
    g_game.particleEmitter.y = this.y;
    g_game.particleEmitter.start(true, 2000, null, 5);
    g_game.vacuum.body.velocity.x = 0;
    g_game.vacuum.body.velocity.y = 0;
    target.game.time.events.add(Phaser.Timer.SECOND * 2, loseGame, this);

  }
}


function initNewspaper(game) {

  g_game.newspaper = game.add.image(game.width/2, game.height/2, 'newspaper');
  g_game.newspaper.anchor.setTo(0.5);
  g_game.newspaper.alpha = 0;
  g_game.newsTitle = game.add.bitmapText(g_game.newspaper.x, g_game.newspaper.y - 52, 'pressStart2p', 'DAILY GRIND', 14);
  g_game.newsTitle.anchor.setTo(0.5);
  g_game.newsTitle.tint = 0x000000;
  g_game.newsTitle.alpha = 0;
  g_game.newsHeadline = game.add.bitmapText(g_game.newspaper.x, g_game.newspaper.y - 34, 'pressStart2p', 'Party at three', 10);
  g_game.newsHeadline.anchor.setTo(0.5);
  g_game.newsHeadline.tint = 0x000000;
  g_game.newsHeadline.alpha = 0;
  g_game.newsSubHeadline = game.add.bitmapText(g_game.newspaper.x+10, g_game.newspaper.y - 20, 'pressStart2p', 'President\nattending', 6);
  g_game.newsSubHeadline.tint = 0x000000;
  g_game.newsSubHeadline.alpha = 0;
  g_game.newsContinue = game.add.bitmapText(g_game.newspaper.x, g_game.newspaper.y + 60, 'pressStart2p', 'Space to Continue...', 8);
  g_game.newsContinue.anchor.setTo(0.5);
  g_game.newsContinue.tint = 0x000000;
  g_game.newsContinue.alpha = 0;

}

function startGame() {

  var level = g_game.rooms[g_game.currentLevel];
  var news = level.titles[Math.floor(Math.random() * level.titles.length)];

  g_game.newspaper.alpha = 1;
  g_game.newsTitle.alpha = 1;
  g_game.newsHeadline.text = news.headLine;
  g_game.newsHeadline.alpha = 1;
  g_game.newsSubHeadline.alpha = 1;
  g_game.newsSubHeadline.text = news.sub;
  g_game.newsContinue.tint = 0x000000;
  g_game.newsContinue.alpha = 1;
}

function winGame() {

  g_game.sfx.vacuum.stop();
  var level = g_game.rooms[g_game.currentLevel];
  var news = level.winMessages[Math.floor(Math.random() * level.winMessages.length)];

  g_game.gameOver = true;
  g_game.won = true;
  g_game.newspaper.alpha = 1;
  g_game.newsTitle.alpha = 1;
  g_game.newsHeadline.text = news.headLine;
  g_game.newsHeadline.alpha = 1;
  g_game.newsSubHeadline.alpha = 1;
  g_game.newsSubHeadline.text = news.sub;
  g_game.newsContinue.tint = 0x44891A;
  g_game.newsContinue.alpha = 1;

  g_game.currentLevel = Math.min(g_game.currentLevel+1, g_game.maxLevel);
}

function loseGame() {

  g_game.sfx.vacuum.stop();
  var level = g_game.rooms[g_game.currentLevel];
  var news = level.failMessages[Math.floor(Math.random() * level.failMessages.length)];

  g_game.gameOver = true;
  g_game.lost = true;
  g_game.newspaper.alpha = 1;
  g_game.newsTitle.alpha = 1;
  g_game.newsHeadline.text = news.headLine;
  g_game.newsHeadline.alpha = 1;
  g_game.newsSubHeadline.alpha = 1;
  g_game.newsSubHeadline.text = news.sub;
  g_game.newsContinue.tint = 0xBE2633;
  g_game.newsContinue.alpha = 1;
}


var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
    this.load.image('newspaper', 'assets/gfx/newspaper.png');

    this.game.load.spritesheet('vacuumMove', 'assets/gfx/vacuum.png', 16, 16);

		this.load.atlasJSONHash('assets', 'assets/gfx/sprites.png', null, g_game.spriteAtlas.assets);
		//this.load.atlasJSONHash('ui', 'assets/gfx/ui.png', null, g_game.spriteAtlas.ui);
		this.load.bitmapFont('pressStart2p', 'assets/fonts/pressStart2p_0.png', 'assets/fonts/pressStart2p.xml');

    this.game.load.audio('tick', ['assets/audio/sfx/tick.wav']);
    this.game.load.audio('vacuum', ['assets/audio/sfx/vacuum.wav']);
    this.game.load.audio('explosion', ['assets/audio/sfx/Explosion.wav']);

		//this.game.load.audio('squiggy', ['https://dl.dropboxusercontent.com/u/102070389/ld32/squiggy.OGG']);

	},
	create: function() {
		var back = this.game.add.image(0, 0, 'background');

    initNewspaper(this.game);
    g_game.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    startGame();
  },
  update: function() {
    if (g_game.spaceKey.isDown) {
      this.game.state.start('game');
    }
  }

};


g_game.spriteAtlas = {};

g_game.spriteAtlas.assets = {
	frames: {
    dirt: { frame: { x: 0, y: 0, w: 2, h: 2 } },
    particle: { frame: { x: 22, y: 0, w: 5, h: 4 } },
    vacuum: { frame: { x: 0, y: 4, w: 16, h: 16 } },
    table: { frame: { x: 0, y: 20, w: 24, h: 20 } },
    sofa: { frame: { x: 24, y: 20, w: 48, h: 20 } },
    lamp: { frame: { x: 0, y: 40, w: 8, h: 12 } },
    statue: { frame: { x: 8, y: 40, w: 17, h: 12 } },
    clock: { frame: { x: 0, y: 52, w: 31, h: 31 } },
    clockHands: { frame: { x: 8, y: 84, w: 20, h: 20 } },
    secondHand: { frame: { x: 0, y: 84, w: 5, h: 26 } },
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
