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
