
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