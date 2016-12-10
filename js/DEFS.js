
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
