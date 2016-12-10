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
