const express = require('express');
const path = require('path');
        const bodyParser=require("body-parser");

const app = express();
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.multipart());

app.use(express.static(__dirname + '/'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req,res) => {
    res.render("index", 
    {'maze' : "[[1,1,0,'E',1],[1,1,0,0,1],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,0,1]]"});
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