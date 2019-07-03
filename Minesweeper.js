var TILE_SIZE = 30;
var HEADER_HEIGHT = 30;
var NUM_ROWS = 16;
var NUM_COLS = 30;
var NUM_BOMBS = 99;

var tiles = [];
var placedBombs = 0;
var flagsPlaced = 0;
var tilesRevealed = 0;
var done = false;
var won = false;
var startTime;
var doneTime;

var flagImage;
var bombImage;
var tileImage;
var xImage;
var numberTileImages = [];

function preload() {
  flagImage = loadImage('res/flagged.png');
  bombImage = loadImage('res/bomb.png');
  tileImage = loadImage('res/facingDown.png');
  xImage = loadImage('res/x.png');
  for (var i = 0; i < 9; i++) {
    numberTileImages.push(loadImage('res/' + i + '.png'));
  }
}
function setup() {
  var canvas = createCanvas(NUM_COLS * TILE_SIZE, HEADER_HEIGHT + NUM_ROWS * TILE_SIZE);
  canvas.parent("canvas_wrapper");

  frameRate(10);

  for (var r = 0; r < NUM_ROWS; r++) {
    var row = [];
    for (var c = 0; c < NUM_COLS; c++) {
      var tile = new Tile();
      row.push(tile);
    }
    tiles.push(row);
  }
}

function draw() {
  background(180);

  fill(0);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("" + (NUM_BOMBS - flagsPlaced), 10, HEADER_HEIGHT / 2);

  textAlign(RIGHT, CENTER);
  var txt = "0";
  if (done) {
    var diff = floor((doneTime - startTime) / 1000);
    txt = "" + diff;
  } else if (placedBombs != 0) {
    var now = new Date();
    var diff = floor((now - startTime) / 1000);
    txt = "" + diff;
  }
  text(txt, NUM_COLS * TILE_SIZE - 10, HEADER_HEIGHT / 2);

  if (done) {
    textAlign(CENTER, CENTER);
    text("SPACE to restart", NUM_COLS * TILE_SIZE / 2, HEADER_HEIGHT / 2);

  }

  for (var r = 0; r < NUM_ROWS; r++) {
    for (var c = 0; c < NUM_COLS; c++) {
      var tile = tiles[r][c];
      tile.drawAt(r, c);
    }
  }
}

function mouseReleased() {
  if (done) {
    return;
  }

  var c = floor(mouseX / TILE_SIZE);
  var r = floor((mouseY - HEADER_HEIGHT) / TILE_SIZE);
  if (c < 0 || c >= NUM_COLS || r < 0 || r >= NUM_ROWS) {
    return;
  }

  if (placedBombs == 0) {
    placeBombs(c, r);
    revealCell(c, r);
    startTime = new Date();
  } else {
    var tile = tiles[r][c];
    if (tile.isHidden) {
      if (mouseButton === LEFT && !keyIsDown(16) && !tile.isFlagged) {
        if (tile.isBomb) {
          revealAll();
          done = true;
          doneTime = new Date();
        } else {
          revealCell(c, r);
        }
      } else if (mouseButton === RIGHT || (mouseButton === LEFT && keyIsDown(16))) {
        tile.isFlagged = !tile.isFlagged;
        flagsPlaced += tile.isFlagged ? 1 : -1;
      }
    }
  }

}

function keyPressed() {
  if (done && keyCode === 32) {
    restart()
  }
}

function restart() {
  for (var r = 0; r < NUM_ROWS; r++) {
    for (var c = 0; c < NUM_COLS; c++) {
      tiles[r][c].reset();
    }
  }
  placedBombs = 0;
  tilesRevealed = 0;
  flagsPlaced = 0;
  done = false;
  won = false;
}

function revealAll() {
  for (var r = 0; r < NUM_ROWS; r++) {
    for (var c = 0; c < NUM_COLS; c++) {
      var tile = tiles[r][c];
      tile.isHidden = false;
    }
  }
}

function revealCell(x, y) {
  var tile = tiles[y][x];
  tile.isHidden = false;
  tilesRevealed++;
  if (tilesRevealed >= NUM_COLS * NUM_ROWS - NUM_BOMBS) {
    won = true;
    done = true;
    doneTime = new Date();
    revealAll();
  }

  if (tile.num == 0 && !tile.isBomb) {
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if ((i == 0 && j == 0) || x + i < 0 || x + i >= NUM_COLS || y + j < 0 || y + j >= NUM_ROWS) {
          continue;
        }
        var tile = tiles[y + j][x + i];
        if (tile.isHidden) {
          revealCell(x + i, y + j);
        }
      }
    }
  }
}


function placeBombs(startX, startY) {
  placedBombs = 0;
  if (NUM_BOMBS < NUM_ROWS * NUM_COLS) {
    while (placedBombs < NUM_BOMBS) {
      var x = Math.floor(randomInt(NUM_COLS));
      var y = Math.floor(randomInt(NUM_ROWS));
      if (Math.abs(x - startX) < 2 && Math.abs(y - startY) < 2) {
        continue;
      }

      var tile = tiles[y][x];
      if (!tile.isBomb) {
        tile.isBomb = true;
        placedBombs++;
      }
    }
  }
  calcNums();
}

function calcNums() {
  for (var r = 0; r < NUM_ROWS; r++) {
    for (var c = 0; c < NUM_COLS; c++) {
      calcNum(c, r);
    }
  }
}

function calcNum(x, y) {
  var total = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if ((i == 0 && j == 0) || x + i < 0 || x + i >= NUM_COLS || y + j < 0 || y + j >= NUM_ROWS) {
        continue;
      }
      if (tiles[y + j][x + i].isBomb) {
        total++;
      }
    }
  }
  if (y >= 0 && y < tiles.length && x >= 0 && x < tiles[y].length) {
    tiles[y][x].num = total;
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}