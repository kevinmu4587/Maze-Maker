// here are our constants. they could've been an array but it would be pointless?
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const NUM_DIRS = 4;

class Maze {
    constructor() {
        this.maze_array = []; //stored as 0s (empty), 1s (walls) and S/E
        this.x = 1;
        this.y = 1;
    }
    set_maze(maze_array) {
        // read in maze, turn to 0s, 1s and S and E
        //set location!!!!
        this.maze_array = [];
        for (var y = 0; y < maze_array.length; ++y) {
          const walls = /[+\-|]/g;
          const spaces = /\./g;
          var new_string = maze_array[y].replace(walls, '1').replace(spaces, '0');
          this.maze_array.push(new_string);
          if (maze_array[y].includes('S')) {
            this.y = y;
            this.x = maze_array[y].indexOf('S');
          }
        }
    }
    get_maze() {
      return this.maze_array;
        // return maze array, with fancy +-|
    }
    move(direction) {
        switch(direction) {
            case UP:
                --this.y;
                break;
            case RIGHT:
                ++this.x;
                break;
            case DOWN:
                ++this.y;
                break;
            case LEFT:
                --this.x;
                break;
            default:
                // uhhh throw some error? idk
        }
        console.log(direction);
        console.log(this.x);
        console.log(this.y);
    }
    is_wall(direction) {
        switch(direction) { 
            case UP:
                return this.maze_array[this.y - 1][this.x] === '1';
            case RIGHT:
                return this.maze_array[this.y][this.x + 1] === '1';
            case DOWN:
                return this.maze_array[this.y + 1][this.x] === '1';
            case LEFT:
                return this.maze_array[this.y][this.x - 1] === '1';
            default:
                // uhhh throw some error? idk
        }
    }
    finished() {
        if (this.maze_array[this.y][this.x] == 'E') {
            console.log('E');
            return true;
        }
        return false;
    }
}

function solve_maze(maze, initial_direction) {
    var direction = initial_direction;
    while (! maze.finished()) {
        for (var i = 0; i < NUM_DIRS; ++i) {
            var try_dir = (i + direction + 3) % NUM_DIRS;
            if (! maze.is_wall(try_dir)) {
                maze.move(try_dir);
                direction = try_dir;
                break;
            }
        }
    }
}

const eg1 =
[
'+-+-+-+-+-+-+-+-+-+-+',
'|E....|.....|.......|',
'+.+-+.+.+-+.+.+-+-+.|',
'|.|...|...|...|.|...|',
'+.+-+-+-+.+-+.+.+.+-+',
'|...|...|...|...|.|.|',
'+-+.+.+-+.+.+-+-+.+.+',
'|.....|...|...|.....|',
'+.+-+-+.+.+-+-+.+-+-+',
'|.......|...|......S|',
'+-+-+-+-+-+-+-+-+-+-+'
];

var sampleMaze = new Maze();
sampleMaze.set_maze(eg1);
solve_maze(sampleMaze, UP);