
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
  currentLevel: 2,
  maxLevel: 2,
	sfx: {},
	vacuumSpeed: 200
};


g_game.rooms = {
	1: {
		vacuum: { x: 20, y: 150},
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
      { headLine: 'Party at Three', sub: 'Could be the\nevent of year'}
    ],
		music: 'squiggy'
	},
  2: {
    vacuum: { x: 20, y: 150},
    time: 20,
    dirt: 100,
    furniture: [
      { sprite: 'table', x: 200, y: 100 },
      { sprite: 'sofa', x: 120, y: 120 }
    ],
    fragiles: [
      { sprite: 'lamp', x: 200, y: 80 }
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'}
    ],
    winMessages: [
      { headLine: 'Party Success!', sub: 'Good time\nby everyone'}
    ],
    titles: [
      { headLine: 'Big Party 3pm', sub: 'Some doofus\nhaving party'},
      { headLine: 'Big Party 3pm', sub: 'Could be the\nevent of year'}
    ],
    music: 'squiggy'
  }
};
