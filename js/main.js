import { Maze, naive_solve_maze } from "./maze_naive_solve.js";

let app, player;
let keys = {};
let keysDiv;
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
const TILE_FINISH = 'E';
const TILE_START = 'S';
// 0 . open 
// 1 wall
// 2 solution
// 3 finish

// 2D array of tiles
let tiles = [
    [1, 1, 1, 1, 1],
    [1, 'S', 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 'E', 1],
    [1, 1, 1, 1, 1]
];

let maze = new Maze();
maze.set_maze(tiles);
console.log(maze.get_maze_array());

let solved_maze = naive_solve_maze(maze, DOWN);
console.log("done solving maze");

for(var i=0; i < 5; i++) {
    for(var j=0; j < 5; j++) {
        console.log(solved_maze[i][j], " ");
    }
    console.log("");
}

// render(): renders the current board and player
//           uses global variable tiles[][]
function render() {
    for (i=0; i < NUM_TILES_Y; i++) {
        for (j=0; j < NUM_TILES_X; j++) {
            if (tiles[i][j] == TILE_OPEN) {
                // do nothing
            } else if (tiles[i][j] == TILE_WALL) {
                // wall tile
                let wall = new PIXI.Sprite.from("images/brick.jpg");
                wall.x = j * TILE_WIDTH;
                wall.y = i * TILE_HEIGHT;
                wall.width = TILE_WIDTH;
                wall.height = TILE_HEIGHT;
                app.stage.addChild(wall);
                //walls.push(wall);
            } else if (tiles[i][j] == TILE_FINISH) {
                // set the finish
                let finish = new PIXI.Sprite.from("images/finish.png");
                finish.x = j * TILE_WIDTH;
                finish.y = i * TILE_HEIGHT;
                finish.width = TILE_WIDTH;
                finish.height = TILE_HEIGHT;
                app.stage.addChild(finish);
                //fBox = finish.getBounds();
            } else if (tiles[i][j] == TILE_START) {
                // set the player
                player = new PIXI.Sprite.from("images/player.png");
                player.x = j * TILE_WIDTH; // 2 * TILE_WIDTH + TILE_WIDTH / 2;
                player.y = i * TILE_HEIGHT; // PIXEL_HEIGHT - 2.5 * TILE_WIDTH;
                player.width = TILE_WIDTH;
                player.height = TILE_HEIGHT;
                app.stage.addChild(player);
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

    /*
    // create the player object
    player = new PIXI.Sprite.from("images/player.png");
    // where transformations are relative to
    player.anchor.set(0.5); // set to center
    // set player position
    player.x = 2 * TILE_WIDTH + TILE_WIDTH / 2;
    player.y = PIXEL_HEIGHT - 2.5 * TILE_WIDTH;
    player.width = TILE_WIDTH;
    player.height = TILE_HEIGHT;
    app.stage.addChild(player);
    */
    render();

    // keyboard event listeners
    window.addEventListener("keydown", keypress);
    window.addEventListener("keyup", keysUp);

    // ticker to call gameLoop function during Pixi eventhandler
    app.ticker.add(gameLoop);
    // to display key info in the body
    keysDiv = document.querySelector("#keys");

    function keypress (e) {
        //console.log(e.keyCode);
        keys[e.keyCode] = true;
    }

    function keysUp (e) {
        let key = e.keyCode;
        if (key == LEFT || key == A) {
            player.x -= collisionLeft();
            console.log(e.keyCode);
        } else if (key == RIGHT || key == D) {
            player.x += collisionRight();
        } else if (key == UP || key == W) {
            player.y -= collisionUp();
        } else if (key == DOWN || key == S) {
            player.y += collisionDown();
        }
        keys[e.keyCode] = false;
    }

    function gameLoop() {
        keysDiv.innerHTML = JSON.stringify(keys);
        let pBox = player.getBounds();
    }

    // getTile(px, py): returns the value of the tile at pixel coordinates px and py
    function getTile(px, py) {
        let tx = Math.floor(px / TILE_WIDTH);
        let ty = Math.floor(py / TILE_HEIGHT);
        // console.log("tx:" + tx);
        // console.log("ty:" + ty);    
        return [tx, ty];
    }

    function collisionDown() {
        let tile = getTile(player.x, player.y + TILE_WIDTH / 2);
        let tx = tile[0];
        let ty = tile[1];
        if (ty == NUM_TILES_Y || tiles[ty][tx] == 1) {
            console.log("below tile is wall");
            return 0;
        }
        return SPEED;
    } 

    function collisionUp() {
        let tile = getTile(player.x, player.y - TILE_WIDTH / 2 - 1);
        let tx = tile[0];
        let ty = tile[1];
        if (ty == -1 || tiles[ty][tx] == 1) {
            console.log("above tile is wall");
            //player.y = (ty + 1) * TILE_WIDTH + 200;
            return 0;
        }
        return SPEED;
    }

    function collisionLeft() {
        let tile = getTile(player.x - TILE_WIDTH / 2 - 1, player.y);
        let tx = tile[0];
        let ty = tile[1];
        if (tx == -1 || tiles[ty][tx] == 1) {
            console.log("tile left of player is a wall")
            //player.x = tx * (TILE_WIDTH + 1) + 32;
            return 0;
        }
        return SPEED;
    }

    function collisionRight() {
        let tile = getTile(player.x + TILE_WIDTH / 2, player.y);
        let tx = tile[0];
        let ty = tile[1];
        if (tx == NUM_TILES_X || tiles[ty][tx] == 1) {
            console.log("right tile is wall");
            return 0;
            //pBox = player.getBounds();
        }
        return SPEED;
    }
}