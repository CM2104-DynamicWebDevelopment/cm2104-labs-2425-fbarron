var express = require('express');

const knockKnockJokes = require('knock-knock-jokes');

app.use(express.static('public'));

var knockJokes = knockKnockJokes();

var app = express();

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

app.listen(8080);