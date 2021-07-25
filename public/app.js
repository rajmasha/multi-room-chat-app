var socket = io();

var userlist = document.getElementById("active_users_list");
var roomlist = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var sendMessageBtn = document.getElementById("send_message_btn");
var roomInput = document.getElementById("roomInput");
var createRoomBtn = document.getElementById("room_add_icon_holder");
var chatDisplay = document.getElementById("chat");

var currentRoom = "global";
var myUsername = "";

// Prompt for username on connecting to server
socket.on("connect", function () {
  myUsername = prompt("Enter name: ");
  socket.emit("createUser", myUsername);
});

// Send message on button click
sendMessageBtn.addEventListener("click", function () {
  socket.emit("sendMessage", message.value);
  message.value = "";
});

// Send message on enter key press
message.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessageBtn.click();
  }
});

// Create new room on button click
createRoomBtn.addEventListener("click", function () {
  // socket.emit("createRoom", prompt("Enter new room: "));
  let roomName = roomInput.value.trim();
  if (roomName !== "") {
    socket.emit("createRoom", roomName);
    roomInput.value = "";
  }
});

socket.on("updateChat", function (username, data) {
  if (username === "INFO") {
    console.log("Displaying announcement");
    chatDisplay.innerHTML += `<div class="announcement"><span>${data}</span></div>`;
  } else {
    console.log("Displaying user message");
    chatDisplay.innerHTML += `<div class="message_holder ${
      username === myUsername ? "me" : ""
    }">
                                <div class="pic"></div>
                                <div class="message_box">
                                  <div id="message" class="message">
                                    <span class="message_name">${username}</span>
                                    <span class="message_text">${data}</span>
                                  </div>
                                </div>
                              </div>`;
  }

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

socket.on("updateUsers", function (usernames) {
  userlist.innerHTML = "";
  console.log("usernames returned from server", usernames);
  for (var user in usernames) {
    userlist.innerHTML += `<div class="user_card">
                              <div class="pic"></div>
                              <span>${user}</span>
                            </div>`;
  }
});

socket.on("updateRooms", function (rooms, newRoom) {
  roomlist.innerHTML = "";

  for (var index in rooms) {
    roomlist.innerHTML += `<div class="room_card" id="${rooms[index].name}"
                                onclick="changeRoom('${rooms[index].name}')">
                                <div class="room_item_content">
                                    <div class="pic"></div>
                                    <div class="roomInfo">
                                    <span class="room_name">#${rooms[index].name}</span>
                                    <span class="room_author">${rooms[index].creator}</span>
                                    </div>
                                </div>
                            </div>`;
  }

  document.getElementById(currentRoom).classList.add("active_item");
});

function changeRoom(room) {
  if (room != currentRoom) {
    socket.emit("updateRooms", room);
    document.getElementById(currentRoom).classList.remove("active_item");
    currentRoom = room;
    document.getElementById(currentRoom).classList.add("active_item");
  }
}
