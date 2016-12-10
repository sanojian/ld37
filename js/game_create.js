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
