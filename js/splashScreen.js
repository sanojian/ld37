
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
