const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Code to define the public "static" folder
app.use(express.static("public"));

// Set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index");
});

io.on("connection", function (socket) {
  console.log("a user connected");

  // Handle joining a room
  socket.on("join room", function (room) {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle leaving a room (optional, if needed)
  socket.on("leave room", function (room) {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  // Handle chat messages sent to a specific room
  socket.on("chat message", function (data) {
    const { room, message, username } = data;
    io.to(room).emit("chat message", { username, message, room });
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(8080, function () {
  console.log("listening on *:8080");
});
