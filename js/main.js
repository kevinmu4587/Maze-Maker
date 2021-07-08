import { Maze, naive_solve_maze } from "./maze_naive_solve.js";

let app, player;

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
const NUM_TILES_Y = 20;
const NUM_TILES_X = 20;
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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 'S', 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 'E', 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let state = "edit";

// render(): renders the current board and player
//           uses global variable tiles[][]
function render() {
    for (var i = 0; i < NUM_TILES_Y; i++) {
        for (var j = 0; j < NUM_TILES_X; j++) {
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

// onload(): load the PIXI game and render the maze
window.onload = function () {
    app = new PIXI.Application(
        {
            width: PIXEL_WIDTH,
            height: PIXEL_HEIGHT,
            backgroundColor: GAME_COLOR
        }
    );
    document.body.appendChild(app.view);
    // keyboard event listeners
    window.addEventListener("keyup", keysUp);
    render();
}
function edit() {
    console.log("drawing");
}

// save/load functions below ------------------------------------------
// saveMaze(): sends the maze to the backend
export function saveMaze() {
    var xhttp = new XMLHttpRequest();
    sendString = JSON.stringify(tiles);
    alert(sendString);
    xhttp.open("POST", "/", true);
    xhttp.send(sendString);
    console.log("sent maze: " + sendString);
}

// loadMaze(): loads a maze from the backend
export function loadMaze() {
    console.log("load maze:");
}
i
// play(): activates player movement.
export function play() {
    console.log("player start:");
    // document.getElementById("play").value = "Edit";
    state = "play"
    // ticker to call gameLoop function during Pixi eventhandler
    //app.ticker.add(gameLoop);
}

// solveMaze(): updates maze to show the pathway
export function solveMaze() {
    console.log("solving maze:");
    let maze = new Maze();
    maze.set_maze(tiles);
    console.log(maze.get_maze_array());

    let solved_maze = naive_solve_maze(maze, DOWN);
    console.log("done solving maze");
    console.log(solved_maze);

    for (var i = 0; i < NUM_TILES_X; i++) {
        for (var j = 0; j < NUM_TILES_Y; j++) {
            if(tiles[i][j] == 2) {
                let solveTile = new PIXI.Sprite.from("images/solved.png");
                solveTile.x = j * TILE_WIDTH;
                solveTile.y = i * TILE_HEIGHT;
                solveTile.width = TILE_WIDTH;
                solveTile.height = TILE_HEIGHT;
                app.stage.addChild(solveTile);
            }
        }
    }
}

// gameplay functions below -------------------------------------------------------
// keysUp(key e): called whenever a key e is pressed. used for player movement
function keysUp(e) {
    if (state == "edit") {
        return;
    }
    let key = e.keyCode;
    if (key == LEFT || key == A) {
        player.x -= collision(player.x - 1, player.y);
        console.log(e.keyCode);
    } else if (key == RIGHT || key == D) {
        player.x += collision(player.x + TILE_WIDTH + 1, player.y);
    } else if (key == UP || key == W) {
        player.y -= collision(player.x, player.y - 1);
    } else if (key == DOWN || key == S) {
        player.y += collision(player.x, player.y + TILE_WIDTH + 1);
    }
}

// collision(int targetX, int targetY): given pixel coordinates (targetX, targetY), determines whether the
//      player should move or not (or display victory message)
function collision(targetX, targetY) {
    let targetTile = getTile(targetX, targetY);
    let tx = targetTile[0];
    let ty = targetTile[1];
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

// getTile(int px, int py): returns the value of the tile at pixel coordinates px and py
function getTile(px, py) {
    let tx = Math.floor(px / TILE_WIDTH);
    let ty = Math.floor(py / TILE_HEIGHT);
    return [tx, ty];
}

// victory(): displays a win message to the screen
function victory() {
    let win = new PIXI.Sprite.from("images/winMsg.png");
    win.x = 0;
    win.y = 0;
    win.width = PIXEL_WIDTH;
    win.height = PIXEL_HEIGHT;
    app.stage.addChild(win);
}