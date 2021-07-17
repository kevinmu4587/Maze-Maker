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

class Queue {
    constructor() {
        this.items = [];
    }
    is_empty() {
        return this.items.length == 0;
    }
    enqueue(i) {
        this.items.push(i);
    }
    dequeue() {
        if (this.is_empty()) {
            throw "Queue Underflow";
        } else {
            return this.items.shift();
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
                if (y <= 0) { return true; }
                return this.maze_array[y - 1][x] === 1;
            case RIGHT_DIR:
                if (x >= this.maze_array[y].length - 1) { return true; }
                return this.maze_array[y][x + 1] === 1;
            case DOWN_DIR:
                if (y >= this.maze_array.length - 1) { return true; }
                return this.maze_array[y + 1][x] === 1;
            case LEFT_DIR:
                if (x <= 0) { return true; }
                return this.maze_array[y][x - 1] === 1;
            default:
                throw 'Invalid direction: at is_wall.';
        }
    }
    get_neighbours(x, y, delta = 1) {
        var neighbours = [
            [x + delta, y],
            [x - delta, y],
            [x, y + delta],
            [x, y - delta]
        ];
        neighbours = neighbours.filter(n => n[0] >= 0 && n[1] >= 0 &&
             n[0] < this.maze_array[0].length && n[1] < this.maze_array.length &&
              this.maze_array[n[1]][n[0]] !== 1);
        return neighbours;
    }
    finished(x, y) {
        if (x == this.end.x && y == this.end.y) {
            console.log('Exit reached!');
            return true;
        }
        return false;
    }
    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    unvisited_neighbours(current_cell, rmaze_array) {
        var x = current_cell[0];
        var y = current_cell[1];
        var neighbours = [
            [x + 2, y],
            [x - 2, y],
            [x, y + 2],
            [x, y - 2]
        ];
        neighbours = neighbours.filter(n => n[0] >= 0 && n[1] >= 0 &&
             n[0] < rmaze_array[0].length && n[1] < rmaze_array.length &&
              rmaze_array[n[1]][n[0]] === 1);
        return neighbours;
    }
    generate_random_maze_unwrapped(rmaze_array, x, y) {//array of all 1s, x and y are dimensions, at least 5
        //main algo
        var visiting_stack = [];
        rmaze_array[1][1] = 0;
        var current_cell = [1, 1];
        visiting_stack.push(current_cell);
        while (visiting_stack.length > 0) {
            current_cell = visiting_stack.pop();
            var neighbours = this.unvisited_neighbours(current_cell, rmaze_array);
            if (neighbours.length > 0) {
                visiting_stack.push(current_cell);
                var rand_index = this.getRandomArbitrary(0, neighbours.length);
                var n = neighbours[rand_index];
                rmaze_array[(current_cell[1] + n[1])/ 2][(current_cell[0] + n[0])/ 2] = 0;
                rmaze_array[n[1]][n[0]] = 0;
                visiting_stack.push(n);
            }
        }
        //at end
        rmaze_array[1][1] = 'S';
        var end_index_x = (x % 2 == 0 ? x - 3: x - 2);
        var end_index_y = (y % 2 == 0 ? y - 3: y - 2);
        rmaze_array[end_index_y][end_index_x] = 'E';
        return rmaze_array;
    }
    generate_random_maze(x = 19, y = 19) { //x and y represent maze size, odd squares work best
        // returns maze array of newly generated maze
        var random_maze = [];
        for (var w = 0; w < y; ++w) { // fill maze with walls.
            var row = new Array(x).fill(1);
            random_maze.push(row);
        }
        if (x < 5 || y < 5) {
            console.log('Maze wasnt generated bc dimensions are too small');
            return random_maze;
        } else {
            return this.generate_random_maze_unwrapped(random_maze, x, y);
        }
    }
}

class MazeSolver {
    naive_solve_maze_unwrapped(maze, initial_direction) {
        // note: please start character in a corner
        var direction = parseInt(initial_direction);
        var path = [];
        var lhwf = new MazePosn(maze.start.x, maze.start.y);
        while (! maze.finished(lhwf.x, lhwf.y)) {
            if (path.length >= 10000) {
                console.log('Couldnt solve maze SORRY!');
                return [];
            }
            var posn = [lhwf.x, lhwf.y];
            path.push(posn);
            for (var i = 0; i < NUM_DIRS; ++i) {
                var try_dir = (i + direction + 3) % NUM_DIRS;
                if (! maze.is_wall(try_dir, lhwf.x, lhwf.y)) {
                    lhwf.move(try_dir);
                    direction = try_dir;
                    break;
                }
            }
        }
        return path; // 2d array of xs and ys
    }
    remove_path_dead_ends(path) {
        var direct_path = JSON.parse(JSON.stringify(path));
        for (var i = 0; i < direct_path.length; ++i) {
            for (var j = i + 1; j < direct_path.length; ++j) {
                if (direct_path[i][0] == direct_path[j][0] && direct_path[i][1] == direct_path[j][1]) {
                    direct_path.splice(i, j - i);
                    break;
                }
            }
        }
        return direct_path;
    }
    naive_solve_maze(maze, initial_direction = DOWN_DIR) {
        var solved_path = this.naive_solve_maze_unwrapped(maze, initial_direction); // 2d array of path
        solved_path = this.remove_path_dead_ends(solved_path); // can i just modify arg?
        var ret_maze_array = maze.get_maze_array();
        for (var i = 0; i < solved_path.length; ++i) {
            ret_maze_array[solved_path[i][1]][solved_path[i][0]] = 2;
        }
        ret_maze_array[maze.start.y][maze.start.x] = 'S';
        return ret_maze_array;
    }
    weird_index(n, explored) {
        for (var i = 0; i < explored.length; ++i) {
            var e = explored[i];
            if (e[0][0] == n[0] && e[0][1] == n[1]) {
                return i;
            }
        }
        return -1;
    }
    bfsearch_unwrapped(maze) {
        var q = new Queue(); //queue of 2 elem arrays
        var explored = []; //3d array???
        var root = [[maze.start.x, maze.start.y], null];
        explored.push(root);
        q.enqueue(root[0]);
        while (! q.is_empty()) {
            var v = q.dequeue();
            if (maze.finished(v[0], v[1])) {
                console.log('bfsearch completed!');
                var path = [];
                while (v !== null) {
                    path.push(v);
                    v = explored[this.weird_index(v, explored)][1];
                }
                return path;
            } else {
                var neighbours = maze.get_neighbours(v[0], v[1]);
                for (var k = 0; k < neighbours.length; ++k) {
                    var n = neighbours[k];
                    if (this.weird_index(n, explored) === -1) {
                        var child = [n, v];
                        explored.push(child);
                        q.enqueue(n);
                    }
                }
            }
        }
        console.log('bfsearch failed');
        return [];
    }
    bfsearch(maze) {
        var solved_path = this.bfsearch_unwrapped(maze); // 2d array of path
        var ret_maze_array = maze.get_maze_array();
        for (var i = 0; i < solved_path.length; ++i) {
            ret_maze_array[solved_path[i][1]][solved_path[i][0]] = 2;
        }
        ret_maze_array[maze.start.y][maze.start.x] = 'S';
        ret_maze_array[maze.end.y][maze.end.x] = 'E';
        return ret_maze_array;
    }
}

export { Maze, MazeSolver};