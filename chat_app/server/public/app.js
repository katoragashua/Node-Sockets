const socket = io("ws://localhost:3500");
const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const userList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");
const message = msgInput.value;
const name = nameInput.value;
const room = chatRoom.value;
const sendMessage = (e) => {
  e.preventDefault();

  console.log(message);

  if (message && name && room) {
    socket.emit("message", {
      text: message,
      name: name,
    });
    msgInput.value = "";
  }
  msgInput.focus();
};

const joinRoom = (e) => {
  e.preventDefault();
  if (room && name) {
    socket.emit("joinRoom", {
      room: room,
      name: name,
    });
    msgInput.value = "";
    msgInput.focus();
  }
};

document.querySelector(".form-msg").addEventListener("submit", sendMessage);
document.querySelector(".form-join").addEventListener("submit", joinRoom);
msgInput.addEventListener("keypress", () => {
  socket.emit("activity", name);
});

socket.on("message", (data) => {
  activity.textContent = "";
  console.log(data);
  const li = document.createElement("li");
  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => (activity.textContent = ""), 2000);
});
