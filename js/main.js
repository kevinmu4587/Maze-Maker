let app, player;
let walls = [];

// constants for player movement
const W = "87";
const A = "65";
const S = "83";
const D = "68";
const LEFT = "37";
const UP = "38";
const RIGHT = "39";
const DOWN = "40";

// game constants
const PIXEL_HEIGHT = 800;
const PIXEL_WIDTH = 800;
const GAME_COLOR = 0xAAAAAA;
const NUM_TILES_Y = 5;
const NUM_TILES_X = 5;
const TILE_WIDTH = PIXEL_WIDTH / NUM_TILES_X;
const TILE_HEIGHT = PIXEL_HEIGHT / NUM_TILES_Y;
const SPEED = TILE_WIDTH;

const TILE_OPEN = 0;
const TILE_WALL = 1;
const TILE_SOLUTION = 2;
const TILE_FINISH = 3;
const TILE_START = 4;
// 0 . open 
// 1 wall
// 2 solution
// 3 finish

// 2D array of tiles
let tiles = [
    [1, 3, 0, 3, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1]
];

// render(): renders the current board and player
//           uses global variable tiles[][]
render = function() {
    for (i=0; i < NUM_TILES_Y; i++) {
        for (j=0; j < NUM_TILES_X; j++) {
            if (tiles[i][j] == TILE_OPEN) {
                // do nothing
            } else if (tiles[i][j] == TILE_WALL) {
                // wall tile
                wall = new PIXI.Sprite.from("images/brick.jpg");
                wall.x = j * TILE_WIDTH;
                wall.y = i * TILE_HEIGHT;
                wall.width = TILE_WIDTH;
                wall.height = TILE_HEIGHT;
                app.stage.addChild(wall);
                //walls.push(wall);
            } else if (tiles[i][j] == TILE_FINISH) {
                // set the finish
                finish = new PIXI.Sprite.from("images/finish.png");
                finish.x = j * TILE_WIDTH;
                finish.y = i * TILE_HEIGHT;
                finish.width = TILE_WIDTH;
                finish.height = TILE_HEIGHT;
                app.stage.addChild(finish);
                //fBox = finish.getBounds();
            }
        }
    }
}

window.onload = function() {
    app = new PIXI.Application(
        {
            width: PIXEL_WIDTH,
            height: PIXEL_HEIGHT,
            backgroundColor: GAME_COLOR
        }
    );
    document.body.appendChild(app.view);

    // create the player object
    player = new PIXI.Sprite.from("images/player.png");
    // where transformations are relative to
    player.anchor.set(0.5); // set to center
    // set player position
    player.x = 2 * TILE_WIDTH + TILE_WIDTH / 2;
    player.y = PIXEL_HEIGHT - TILE_WIDTH / 2;
    player.width = TILE_WIDTH;
    player.height = TILE_HEIGHT;
    app.stage.addChild(player);
    render();

    // keyboard event listeners
    window.addEventListener("keyup", keysUp);

    // ticker to call gameLoop function during Pixi eventhandler
    app.ticker.add(gameLoop);

    function keysUp (e) {
        key = e.keyCode;
        if (key == LEFT || key == A) {
            player.x -= collision(player.x - TILE_WIDTH / 2 - 1, player.y);
            console.log(e.keyCode);
        } else if (key == RIGHT || key == D) {
            player.x += collision(player.x + TILE_WIDTH / 2 + 1, player.y);
        } else if (key == UP || key == W) {
            player.y -= collision(player.x, player.y - TILE_WIDTH / 2 - 1);
        } else if (key == DOWN || key == S) {
            player.y += collision(player.x, player.y + TILE_WIDTH / 2);
        }
    }

    function gameLoop() {
    }

    // getTile(px, py): returns the value of the tile at pixel coordinates px and py
    function getTile(px, py) {
        tx = Math.floor(px / TILE_WIDTH);
        ty = Math.floor(py / TILE_HEIGHT); 
        return [tx, ty];
    }

    function victory() {
        win = new PIXI.Sprite.from("images/winMsg.png");
        win.x = 0;
        win.y = 0;
        win.width = PIXEL_WIDTH;
        win.height = PIXEL_HEIGHT;
        app.stage.addChild(win);
    }

    function collision(targetX, targetY) {
        targetTile = getTile(targetX, targetY);
        tx = targetTile[0];
        ty = targetTile[1];
        // console.log("tx: " + tx);
        // console.log("ty: " + ty);
        if (tx < 0 || tx >= NUM_TILES_X || ty < 0 || ty >= NUM_TILES_Y) {
            console.log("trying to move outside the board");
            return 0;
        } else if (tiles[ty][tx] == TILE_WALL) {
            console.log("trying to move into a wall");
            return 0;
        } else if (tiles[ty][tx] == TILE_FINISH) {
            victory();
            console.log("victory!");
            return SPEED;
        } else {
            console.log("moving...");
            return SPEED;
        }
    }
}