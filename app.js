const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
// let cors = require("cors");
// app.use(cors());

// app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// app.use(bodyParser.json());

// Create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'mazemaker'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE mazemaker';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.send('Database created')
    });
});

// Create Table
app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE maze(id int AUTO_INCREMENT, mazeArray TEXT, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Table created');
    })
})

app.get('/updatetable', (req, res) => {
    let sql = 'ALTER TABLE maze MODIFY mazeArray TEXT';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Table altered');
    })
})

// addMaze Function
// - Inserts array (string) to the database
function addMaze(array) {
    let data = {mazeArray : array};
    let sql = "INSERT INTO maze SET ?";
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
}

// Add MazeArray into Table
app.post('/addmaze', (req, res) => {
    console.log(req.body.maze);
    // addMaze("[[0,0,0,'E',0],[1,1,0,0,1],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,0,1]]");
    addMaze(JSON.stringify(req.body.maze));
    res.send('Maze added to database');
})

// Get MazeArray from Table
app.post('/getmaze', (req, res) => {
    let id = req.body.id;
    console.log("we got a get request of id " + id)
    let sql = `SELECT mazeArray FROM maze WHERE id = ${id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result[0].mazeArray);
        //return result[0].mazeArray;
        res.send({"maze": result[0].mazeArray});
    });
    //let mazeArray = getMaze(id);
    //res.send({"maze": mazeArray});
    //let msg = "" + mazeArray;
    //console.log(msg)
    //res.send({message: msg});
})

app.get('/getID', (req, res) => {
    let sql = 'SELECT id FROM maze ORDER BY id DESC LIMIT 5';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        var n = result.length;
        var arr = [];
        result.forEach(element => arr.push(element.id));
        res.send({"idArray": arr, "idCount": n});
    })
})

app.use(express.static(__dirname + '/'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.set('views', __dirname);

// Index Page
app.get('/', (req,res) => {
    let mazeArray = getMaze(1);
    res.render("index", mazeArray);
})

app.all('*', (req,res) => {
    res.status(404).send('Resource not found')
})

app.listen(5000, () => {
    console.log('server is running on port 5000')
})

app.post('/', (req,res) => {
    console.log("received: " +  req.body); //prints the maze
})

// Export getMaze and addMaze function
// module.exports = { getMaze, addMaze };
// export { addMaze, getMaze };