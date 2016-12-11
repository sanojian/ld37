
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
  currentLevel: 3,
  maxLevel: 4,
	sfx: {},
	vacuumSpeed: 200
};


g_game.rooms = {
	1: {
		vacuum: { x: 100, y: 100},
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
      { headLine: 'Party at Three', sub: 'Slow year\nin news'}
    ],
		music: 'squiggy'
	},
  2: {
    vacuum: { x: 100, y: 100},
    time: 20,
    dirt: 100,
    furniture: [
      { sprite: 'table', x: 200, y: 100 },
      { sprite: 'sofa', x: 120, y: 120 }
    ],
    fragiles: [
      { sprite: 'lamp', x: 190, y: 80 }
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'},
      { headLine: 'Party a Failure', sub: 'House\ncondemned'}
    ],
    winMessages: [
      { headLine: 'Party Success!', sub: 'Good time\nby everyone'}
    ],
    titles: [
      { headLine: 'Big Party 3pm', sub: 'Neighborhood\nexcited'},
      { headLine: 'Big Party 3pm', sub: 'Not sure why\nthis is news'}
    ],
    music: 'squiggy'
  },
  4: {
    vacuum: { x: 180, y: 60},
    time: 20,
    dirt: 200,
    furniture: [
      { sprite: 'table', x: 40, y: 80 },
      { sprite: 'table', x: 40, y: 120 },
      { sprite: 'sofa', x: 90, y: 100 }
    ],
    fragiles: [
      { sprite: 'lamp', x: 30, y: 60 },
      { sprite: 'statue', x: 38, y: 60 },
      { sprite: 'lamp', x: 34, y: 100 }
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'},
      { headLine: 'Party a Failure', sub: 'House\ncondemned'}
    ],
    winMessages: [
      { headLine: 'Game won!', sub: 'Sorry no\nwin screen'}
    ],
    titles: [
      { headLine: 'Grand Gala at 3', sub: 'President\ninvited'},
      { headLine: 'Grand Gala at 3', sub: 'Could be the\nevent of year'}
    ],
    music: 'squiggy'
  },
  3: {
    vacuum: { x: 180, y: 60},
    time: 15,
    dirt: 200,
    furniture: [
      { sprite: 'sofa', x: 34, y: 100 },
      { sprite: 'sofa', x: 90, y: 100 },
      { sprite: 'sofa', x: 144, y: 100 },
      { sprite: 'sofa', x: 194, y: 100 }
    ],
    fragiles: [
    ],
    failMessages: [
      { headLine: 'Party a Failure', sub: 'Guests\ndisgusted'},
      { headLine: 'Party a Failure', sub: 'House\ncondemned'}
    ],
    winMessages: [
      { headLine: 'Clean party!', sub: 'Nobody looked\nunder sofa'}
    ],
    titles: [
      { headLine: '3pm Block party', sub: 'Neighborhood\nexcited'},
      { headLine: '3pm Block party', sub: 'Could be a\nbig event'}
    ],
    music: 'squiggy'
  }
};
