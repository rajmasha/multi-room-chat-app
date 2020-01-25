var socket = io.connect("http://localhost:5000");

var userlist = document.getElementById("userlist");
var roomlist = document.getElementById("roomlist");
var message = document.getElementById("message");
var sendMessageBtn = document.getElementById("send");
var createRoomBtn = document.getElementById("create-room");
var messages = document.getElementById("msg");
var chatDisplay = document.getElementById("chat-display");

var currentRoom = "global";

// Send message on button click
sendMessageBtn.addEventListener("click", function () {
  socket.emit("sendMessage", message.value);
  message.value = "";
});

// Send message on enter key press
message.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    sendMessageBtn.click();
  }
});

// Create new room on button click
createRoomBtn.addEventListener("click", function () {
  socket.emit("createRoom", prompt("Enter new room: "));
});


socket.on("connect", function() {
  socket.emit("createUser", prompt("Enter name: "));
});


socket.on("updateChat", function(username, data) {
  if (username == "INFO") {
    messages.innerHTML +=
      "<p class='alert alert-warning w-100'>" + data + "</p>";
  } else {
    messages.innerHTML +=
      "<p><span><strong>" + username + ": </strong></span>" + data + "</p>";
  }

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});


socket.on("updateUsers", function(usernames) {
  userlist.innerHTML = "";

  for (var user in usernames) {
    userlist.innerHTML += "<li>" + user + "</li>";
  }
});


socket.on("updateRooms", function(rooms, newRoom) {
  roomlist.innerHTML = "";

  for (var index in rooms) {
    roomlist.innerHTML +=
      '<li class="rooms" id="' +
      rooms[index] +
      '" onclick="changeRoom(\'' +
      rooms[index] +
      "')\"># " +
      rooms[index] +
      "</li>";
  }

  if (newRoom != null) {
    document.getElementById(newRoom).classList.add("text-warning");
  } else {
    document.getElementById(currentRoom).classList.add("text-warning");
  }

});


function changeRoom(room) {

  if (room != currentRoom) {
    socket.emit("updateRooms", room);
    document.getElementById(currentRoom).classList.remove("text-warning");
    currentRoom = room;
    document.getElementById(currentRoom).classList.add("text-warning");
  }

}


