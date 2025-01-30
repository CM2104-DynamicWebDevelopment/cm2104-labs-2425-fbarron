var express = require('express');

const knockKnockJokes = require('knock-knock-jokes');


var knockJokes = knockKnockJokes();

var app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

app.get('/', function (req, res) {
  res.send('Hello World! By Express');
});

app.get('/test', function (req, res) {
    res.send("This is route 2");
});

app.get('/joke', function (req, res) {
    res.send(knockJokes);
});

app.get('/add', function (req, res) {
    var x = req.query.x;
    var y = req.query.y;
    res.send("X + Y=" + (parseInt(x) + parseInt(y)));
});

app.get('/calc', function (req, res) {
    var x = req.query.x;
    var y = req.query.y;
    var operator = req.query.operator;
    
    switch(operator) {
        case 'add':
            res.send("X + Y=" + (parseInt(x) + parseInt(y)));
            break;
        case 'sub':
            res.send("X - Y=" + (parseInt(x) - parseInt(y)));
            break;
        case 'mul':
            res.send("X * Y=" + (parseInt(x) * parseInt(y)));
            break;
        case 'div':
            res.send("X / Y=" + (parseInt(x) / parseInt(y)));
            break;
    }});

    app.get('/getform', function(req, res){
        var name = req.query.name;
        var quest = req.query.quest;
        res.send("Hi "+name+" I am sure you will "+quest) ;
        });

    app.post('/postform', function(req, res){
        var name = req.body.name;
        var quest = req.body.quest;
        res.send("Hi "+name+" I am sure you will "+quest) ;
        });

    app.get('/user/:userID/books/:bookID', function(req, res){
        var userID = req.params.userID;
        var bookID = req.params.bookID;
        res.send("User ID is: "+userID+" and Book ID is: "+bookID);
        });

    app.use(function ( req, res, next) {
        res.send('This page does not exist!')
        })

app.listen(8080);