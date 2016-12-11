GameState.prototype.create = function() {

  g_game.gameOver = false;
  g_game.lost = false;
  g_game.won = false;
  var level = g_game.rooms[g_game.currentLevel];

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.gravity.y = 400;

  this.game.add.image(0, 0, 'background');

  g_game.fragiles = this.game.add.group();
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

  g_game.vacuum = this.game.add.sprite(100, 100, 'assets', 'vacuum');
  g_game.vacuum.anchor.setTo(0.5);
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

  initNewspaper(this.game);

  g_game.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
  g_game.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  g_game.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  g_game.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  g_game.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

function contactDirt(target) {
    this.destroy();
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
