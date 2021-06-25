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
    set_x(x) {
        this.x = x;
    }
    get_x() {
        return this.x;
    }
    set_y(y) {
        this.y = y;
    }
    get_y() {
        return this.y;
    }
    set_maze(maze_array) {
        this.maze_array = maze_array;
        for (var y = 0; y < maze_array.length; ++y) {
          if (maze_array[y].includes('S')) {
            set_y(y);
            set_x(maze_array[y].indexOf('S'));
          }
        }
    }
    get_maze_array() {
      return this.maze_array;
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
                throw 'Invalid direction: at move.';
        }
    }
    is_wall(direction) {
        switch(direction) { 
            case UP:
                return this.maze_array[this.y - 1][this.x] === 1;
            case RIGHT:
                return this.maze_array[this.y][this.x + 1] === 1;
            case DOWN:
                return this.maze_array[this.y + 1][this.x] === 1;
            case LEFT:
                return this.maze_array[this.y][this.x - 1] === 1;
            default:
                throw 'Invalid direction: at is_wall.';
        }
    }
    finished() {
        if (this.maze_array[this.y][this.x] == 'E') {
            console.log('Exit reached!');
            return true;
        }
        return false;
    }
}

function naive_solve_maze(maze, initial_direction = DOWN) {
    // note: please start character at top of maze, near upper wall for now bc of initial_direction
    var direction = initial_direction;
    var ret_maze_array = maze.get_maze();
    var original_x = maze.get_x();
    var original_y = maze.get_y();
    while (! maze.finished()) {
        ret_maze_array[maze.get_y()][maze.get_x()] = 2;  // 2 will represent path
        for (var i = 0; i < NUM_DIRS; ++i) {
            var try_dir = (i + direction + 3) % NUM_DIRS;
            if (! maze.is_wall(try_dir)) {
                maze.move(try_dir);
                direction = try_dir;
                break;
            }
        }
    }
    maze.set_x(original_x);
    maze.set_y(original_y);
    ret_maze_array[maze.get_y()][maze.get_x()] = 'S';
    return ret_maze_array; //returns the array of arrays ONLY
}

const eg1 =
[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 'S', 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1], 
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1], 
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1], 
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1], 
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 'E', 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//var sampleMaze = new Maze();
//sampleMaze.set_maze(eg1);
//naive_solve_maze(sampleMaze, UP);