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
const SPEED = 5;

// 2D array of tiles
let tiles = [
    [1, 1, 0, 0, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1]
];

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
    player.x = app.view.width / 2;
    player.y = app.view.height - 32;
    player.width = TILE_WIDTH;
    player.height = TILE_HEIGHT;
    app.stage.addChild(player);

    // set up the board
    for (i=0; i < NUM_TILES_Y; i++) {
        for (j=0; j < NUM_TILES_X; j++) {
            if (tiles[i][j] == 0) {
                // do nothing
            } else if (tiles[i][j] == 1) {
                wall = new PIXI.Sprite.from("images/brick.jpg");
                wall.x =  j * TILE_WIDTH;
                wall.y = i * TILE_HEIGHT;
                wall.width = TILE_WIDTH;
                wall.height = TILE_HEIGHT;
                app.stage.addChild(wall);
                walls.push(wall);
            }
        }
    }
    /*
    for(i=0; i < 20; i++) {
        wall = new PIXI.Sprite.from("images/brick.jpg");
        wall.x = app.view.width / 2 + 32;
        wall.y = app.view.height - (i+1) * 32;
        wall.width = 32;
        wall.height = 32;
        app.stage.addChild(wall);
        walls.push(wall);
    }


    for(i=0; i < 20; i++) {
        wall = new PIXI.Sprite.from("images/brick.jpg");
        wall.x = app.view.width / 2 - 64;
        wall.y = app.view.height - (i+1) * 32;
        wall.width = 32;
        wall.height = 32;
        app.stage.addChild(wall);
        walls.push(wall);
    }
    */

    // set the finish
    finish = new PIXI.Sprite.from("images/finish.png");
    finish.x = PIXEL_WIDTH / 2;
    finish.y = 0;
    finish.width = TILE_WIDTH;
    finish.height = TILE_HEIGHT;
    app.stage.addChild(finish);
    fBox = finish.getBounds();

    // keyboard event listeners
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);

    // ticker to call gameLoop function during Pixi eventhandler
    app.ticker.add(gameLoop);
    // to display key info in the body
    keysDiv = document.querySelector("#keys");

    function keysDown (e) {
        console.log(e.keyCode);
        keys[e.keyCode] = true;
    }

    function keysUp (e) {
        console.log(e.keyCode);
        keys[e.keyCode] = false;
    }

    function gameLoop() {
        keysDiv.innerHTML = JSON.stringify(keys);
        pBox = player.getBounds();
        // check if finished
        /*
        console.log("pBox.x", pBox.x);
        console.log("pBox.y", pBox.y);
        console.log("fBox.x", fBox.x);
        console.log("fBox.y", fBox.y);
        */
        if(pBox.x + pBox.width > fBox.x && pBox.y + pBox.height < fBox.y + fBox.height) {
            console.log("FINSIH")
            win = new PIXI.Sprite.from("images/winMsg.png");
            win.x = 0;
            win.y = 0;
            app.stage.addChild(win);
        }
        
        // player movement
        if (keys[W] || keys[UP] && player.y > 0) { player.y -= collisionUp(); } 
        if (keys[A] || keys[LEFT] && player.x > 0) { player.x -= collisionLeft(); }
        if (keys[S] || keys[DOWN] && player.y + (TILE_WIDTH / 2) < PIXEL_HEIGHT) { player.y += collisionDown(); }
        if (keys[D] || keys[RIGHT] && player.x < PIXEL_WIDTH) { player.x += collisionRight(); }
    }

    // getTile(px, py): returns the value of the tile at pixel coordinates px and py
    function getTile(px, py) {
        tx = Math.floor(px / TILE_WIDTH);
        ty = Math.floor(py / TILE_HEIGHT);
        // console.log("tx:" + tx);
        // console.log("ty:" + ty);    
        return [tx, ty];
    }

    function collisionDown(walls) {
        tile = getTile(player.x, player.y + TILE_WIDTH / 2);
        tx = tile[0];
        ty = tile[1];
        if (tiles[ty][tx] == 1) {
            console.log("below tile is wall");
            return 0;
            pBox = player.getBounds();
            wBox = walls[i].getBounds();
            if (pBox.y + pBox.height == wBox.y && pBox.x > wBox.x - wBox.width && pBox.x < wBox.x + wBox.width) {
                return 0;
            }
        }
        return SPEED;
    } 

    function collisionUp(walls) {
        tile = getTile(player.x, player.y - 19);
        tx = tile[0];
        ty = tile[1];
        if (tiles[ty][tx] == 1) {
            console.log("above tile is wall");
            player.y = (ty + 1) * TILE_WIDTH + 200;
            return 0;
        }
        return SPEED;
    }

    function collisionLeft(walls) {
        tile = getTile(player.x - 16, player.y);
        // console.log("playerx:" + player.x);
        // console.log("playery:" + player.y)
        tx = tile[0];
        ty = tile[1];
        // console.log("tile left: " + tiles[ty][1]);
        if (tiles[ty][tx] == 1) {
            console.log("tile left of player is a wall")
            player.x = tx * (TILE_WIDTH + 1) + 32;
            return 0;
        }
        return SPEED;
    }

    function collisionRight(walls) {
        tile = getTile(player.x + 16, player.y);
        tx = tile[0];
        ty = tile[1];
        if (tiles[ty][tx] == 1) {
            console.log("right tile is wall");
            return 0;
            pBox = player.getBounds();
        }
        return SPEED;
    }
}