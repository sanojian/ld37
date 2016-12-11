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
  if (target.sprite === g_game.vacuum) {
    loseGame();
  }
}
