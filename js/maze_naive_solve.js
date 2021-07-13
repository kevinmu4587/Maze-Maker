const UP_DIR = 0;
const RIGHT_DIR = 1;
const DOWN_DIR = 2;
const LEFT_DIR = 3;
const NUM_DIRS = 4;

class MazePosn {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    move(direction) {
        switch(direction) {
            case UP_DIR:
                --this.y;
                break;
            case RIGHT_DIR:
                ++this.x;
                break;
            case DOWN_DIR:
                ++this.y;
                break;
            case LEFT_DIR:
                --this.x;
                break;
            default:
                throw 'Invalid direction: at move.';
        }
    }
}

class Maze {
    constructor() {
        this.maze_array = []; //stored as 0s (empty), 1s (walls) and S/E
        this.start = new MazePosn();
        this.end = new MazePosn();
    }
    set_maze(maze_array) {
        this.maze_array = maze_array;
        for (var y = 0; y < maze_array.length; ++y) {
          if (maze_array[y].includes('S')) {
            this.start.y = y;
            this.start.x = maze_array[y].indexOf('S');
          }
          if (maze_array[y].includes('E')) {
            this.end.y = y;
            this.end.x = maze_array[y].indexOf('E');
          }
        }
    }
    get_maze_array() { 
      return JSON.parse(JSON.stringify(this.maze_array));
    }
    // maybe add a f'n to check there is exactly one start/end????
    is_wall(direction, x, y) { 
        switch(direction) { 
            case UP_DIR:
                if (y == 0) { return true; }
                return this.maze_array[y - 1][x] === 1;
            case RIGHT_DIR:
                if (x == this.maze_array[y].length - 1) { return true; }
                return this.maze_array[y][x + 1] === 1;
            case DOWN_DIR:
                if (y == this.maze_array.length - 1) { return true; }
                return this.maze_array[y + 1][x] === 1;
            case LEFT_DIR:
                if (x == 0) { return true; }
                return this.maze_array[y][x - 1] === 1;
            default:
                throw 'Invalid direction: at is_wall.';
        }
    }
    finished(x, y) {
        if (x == this.end.x && y == this.end.y) {
            console.log('Exit reached!');
            return true;
        }
        return false;
    }
}

class MazeSolver {
    naive_solve_maze(maze, initial_direction = DOWN_DIR) {
        // note: please start character at top of maze, near upper wall for now bc of initial_direction
        var direction = parseInt(initial_direction);
        var ret_maze_array = maze.get_maze_array(); 
        var lhwf = new MazePosn(maze.start.x, maze.start.y);
        while (! maze.finished(lhwf.x, lhwf.y)) {
            ret_maze_array[lhwf.y][lhwf.x] = 2;  // 2 will represent path
            for (var i = 0; i < NUM_DIRS; ++i) {
                var try_dir = (i + direction + 3) % NUM_DIRS;
                if (! maze.is_wall(try_dir, lhwf.x, lhwf.y)) {
                    lhwf.move(try_dir);
                    direction = try_dir;
                    break;
                }
            }
        }
        ret_maze_array[maze.start.y][maze.start.x] = 'S';
        return ret_maze_array; // let's make this a list of posns? or just 2d array
    }
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

const eg2 = [
    [1, 'S', 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 'E', 1]
];

export { Maze, MazeSolver};