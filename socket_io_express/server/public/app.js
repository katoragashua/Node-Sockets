const socket = io("ws://localhost:3500");
const msgInput = document.querySelector("input");
const activity = document.querySelector(".activity");

const sendMessage = (e) => {
  e.preventDefault();
  const message = msgInput.value;
  console.log(message);

  if (message) {
    socket.emit("message", message);
    msgInput.value = "";
  }
  msgInput.focus();
};

document.querySelector("form").addEventListener("submit", sendMessage);

socket.on("message", (data) => {
  activity.textContent = "";
  console.log(data);
  const li = document.createElement("li");
  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});

msgInput.addEventListener("keypress", () => {
  socket.emit("activity", socket.id.substring(0, 5));
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => (activity.textContent = ""), 2000);
});
