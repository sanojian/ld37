
function initNewspaper(game) {

  g_game.newspaper = game.add.image(game.width/2, game.height/2, 'newspaper');
  g_game.newspaper.anchor.setTo(0.5);
  g_game.newspaper.alpha = 0;
  g_game.newsTitle = game.add.bitmapText(g_game.newspaper.x, g_game.newspaper.y - 52, 'pressStart2p', 'DAILY GRIND', 14);
  g_game.newsTitle.anchor.setTo(0.5);
  g_game.newsTitle.tint = 0x000000;
  g_game.newsTitle.alpha = 0;
  g_game.newsHeadline = game.add.bitmapText(g_game.newspaper.x, g_game.newspaper.y - 34, 'pressStart2p', 'Party at three', 10);
  g_game.newsHeadline.anchor.setTo(0.5);
  g_game.newsHeadline.tint = 0x000000;
  g_game.newsHeadline.alpha = 0;
  g_game.newsSubHeadline = game.add.bitmapText(g_game.newspaper.x+10, g_game.newspaper.y - 20, 'pressStart2p', 'President\nattending', 6);
  g_game.newsSubHeadline.tint = 0x000000;
  g_game.newsSubHeadline.alpha = 0;
  g_game.newsContinue = game.add.bitmapText(g_game.newspaper.x, g_game.newspaper.y + 60, 'pressStart2p', 'Space to Continue...', 8);
  g_game.newsContinue.anchor.setTo(0.5);
  g_game.newsContinue.tint = 0x000000;
  g_game.newsContinue.alpha = 0;

}

function startGame() {

  var level = g_game.rooms[g_game.currentLevel];
  var news = level.titles[Math.floor(Math.random() * level.titles.length)];

  g_game.newspaper.alpha = 1;
  g_game.newsTitle.alpha = 1;
  g_game.newsHeadline.text = news.headLine;
  g_game.newsHeadline.alpha = 1;
  g_game.newsSubHeadline.alpha = 1;
  g_game.newsSubHeadline.text = news.sub;
  g_game.newsContinue.tint = 0x000000;
  g_game.newsContinue.alpha = 1;
}

function winGame() {

  g_game.sfx.vacuum.stop();
  var level = g_game.rooms[g_game.currentLevel];
  var news = level.winMessages[Math.floor(Math.random() * level.winMessages.length)];

  g_game.gameOver = true;
  g_game.won = true;
  g_game.newspaper.alpha = 1;
  g_game.newsTitle.alpha = 1;
  g_game.newsHeadline.text = news.headLine;
  g_game.newsHeadline.alpha = 1;
  g_game.newsSubHeadline.alpha = 1;
  g_game.newsSubHeadline.text = news.sub;
  g_game.newsContinue.tint = 0x44891A;
  g_game.newsContinue.alpha = 1;

  g_game.currentLevel = Math.min(g_game.currentLevel+1, g_game.maxLevel);
}

function loseGame() {

  g_game.sfx.vacuum.stop();
  var level = g_game.rooms[g_game.currentLevel];
  var news = level.failMessages[Math.floor(Math.random() * level.failMessages.length)];

  g_game.gameOver = true;
  g_game.lost = true;
  g_game.newspaper.alpha = 1;
  g_game.newsTitle.alpha = 1;
  g_game.newsHeadline.text = news.headLine;
  g_game.newsHeadline.alpha = 1;
  g_game.newsSubHeadline.alpha = 1;
  g_game.newsSubHeadline.text = news.sub;
  g_game.newsContinue.tint = 0xBE2633;
  g_game.newsContinue.alpha = 1;
}
