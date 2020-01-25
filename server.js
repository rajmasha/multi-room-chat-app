var express = require("express");
var socket = require("socket.io");

var app = express();

app.use(express.static("public"));

var server = app.listen(5000, function() {
  console.log("Listening to port 5000.");
});

var io = socket(server);

// Global variables to hold all usernames and rooms created
var usernames = {};
var rooms = ["global", "chess", "video-games"];

io.on("connection", function(socket) {

  console.log("User connected to server.");

  socket.on("createUser", function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.currentRoom = "global";
    socket.join("global");
    socket.emit("updateChat", "INFO", "You have joined global room");
    socket.broadcast
      .to("global")
      .emit("updateChat", "INFO", username + " has joined global room");
    io.sockets.emit("updateUsers", usernames);
    socket.emit("updateRooms", rooms, "global");
  });


  socket.on("sendMessage", function(data) {
    io.sockets
      .to(socket.currentRoom)
      .emit("updateChat", socket.username, data);
  });


  socket.on("createRoom", function(room) {
    if (room != null) {
      rooms.push(room);
      io.sockets.emit("updateRooms", rooms, null);
    }
  });


  socket.on("updateRooms", function(room) {
    socket.broadcast
      .to(socket.currentRoom)
      .emit("updateChat", "INFO", socket.username + " left room");
    socket.leave(socket.currentRoom);
    socket.currentRoom = room;
    socket.join(room);
    socket.emit("updateChat", "INFO", "You have joined " + room + " room");
    socket.broadcast
      .to(room)
      .emit("updateChat", "INFO", socket.username + " has joined " + room + " room");
  });


  socket.on("disconnect", function() {
    delete usernames[socket.username];
    io.sockets.emit("updateUsers", usernames);
    socket.broadcast.emit("updateChat", "INFO", socket.username + " has disconnected");
  });

});
