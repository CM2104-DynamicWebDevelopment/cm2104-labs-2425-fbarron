var express = require('express');

const knockKnockJokes = require('knock-knock-jokes');
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

app.listen(8080);