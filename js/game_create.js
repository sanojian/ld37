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
