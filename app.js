const express = require('express');
const path = require('path');
const bodyParser=require("body-parser");
const mysql = require('mysql');

const app = express();
        // app.use(express.json());
        // app.use(express.urlencoded());
        // app.use(express.multipart());

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
    let sql = 'CREATE TABLE maze(id int AUTO_INCREMENT, mazeArray VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Table created');
    })
})

// addMaze Function
// - Inserts array (string) to the database
function addMaze(array) {
    let data = {mazeArray : array};
    let sql = 'INSERT INTO maze SET ?';
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
}

// Add MazeArray into Table
app.get('/addmaze', (req, res) => {
    addMaze("[[0,0,0,'E',0],[1,1,0,0,1],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,0,1]]");
    res.send('Maze added to database')
})

// getMaze Function
function getMaze(id) {
    let sql = `SELECT mazeArray FROM maze WHERE id = ${id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result[0].mazeArray);
        return result[0].mazeArray;
    });
}

// Get MazeArray from Table
app.get('/getmaze/:id', (req, res) => {
    let mazeArray = getMaze(1);
    res.send(mazeArray);
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
module.exports = { getMaze, addMaze };