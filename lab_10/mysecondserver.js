
var http = require('http');
var currentDate = require('./mymodule');

http.createServer(function (req, res) {

 res.writeHead(200, {'Content-Type': 'text/html'});
 res.write("The date and time are currently: " + currentDate.myDateTime());
 res.end('Hello World!');
 
}).listen(8080);