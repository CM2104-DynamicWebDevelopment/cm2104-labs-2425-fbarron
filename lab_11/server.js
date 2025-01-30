var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World! By Express');
});

app.listen(8080);