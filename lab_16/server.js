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

const users = {}; // Store username-to-socket mappings

io.on("connection", function (socket) {
  console.log("A user connected");

  // Handle user registration (username assignment)
  socket.on("register", function (username) {
    users[username] = socket.id; // Map username to socket ID
    console.log(`${username} has connected`);
  });

  // Handle private messages
  socket.on("private message", function (data) {
    const { to, message, from } = data; // Data includes recipient, message, and sender
    const recipientSocketId = users[to]; // Get recipient's socket ID

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private message", {
        from,
        message,
      });
    } else {
      console.log(`User ${to} is not online`);
    }
  });

  // Handle disconnect
  socket.on("disconnect", function () {
    for (const [username, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[username];
        console.log(`${username} has disconnected`);
      }
    }
  });
});

http.listen(8080, function () {
  console.log("listening on *:8080");
});
