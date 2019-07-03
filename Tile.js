
class Tile {
    constructor() {
        this.reset()
    }

    reset() {
        this.isBomb = false;
        this.isHidden = true;
        this.isFlagged = false;
        this.num = -1;
    }

    drawAt(r, c) {
        var x = c * TILE_SIZE;
        var y = r * TILE_SIZE + HEADER_HEIGHT;

        if (this.isFlagged) {
            if (done && !this.isBomb) {
                image(numberTileImages[0], x, y, TILE_SIZE, TILE_SIZE);
                image(bombImage, x, y, TILE_SIZE, TILE_SIZE);
                image(xImage, x, y, TILE_SIZE, TILE_SIZE);
            } else {
                image(flagImage, x, y, TILE_SIZE, TILE_SIZE);
            }
        } else if (this.isHidden) {
            image(tileImage, x, y, TILE_SIZE, TILE_SIZE);
        } else if (this.isBomb) {
            fill(255, 0, 0);
            rect(x, y, TILE_SIZE, TILE_SIZE);
            image(bombImage, x, y, TILE_SIZE, TILE_SIZE);
        } else {
            image(numberTileImages[this.num], x, y, TILE_SIZE, TILE_SIZE);
        }

    }
}
