const socket = io("ws://localhost:3500");

const sendMessage = (e) => {
  e.preventDefault();
  const input = document.querySelector("input");
  const message = input.value;
  console.log(message);

  if (message) {
    socket.emit("message", message);
    input.value = "";
  }
  input.focus();
};

document.querySelector("form").addEventListener("submit", sendMessage);

socket.on("message", (data) => {
  console.log("abracadabra");

  console.log(data);
  const li = document.createElement("li");
  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});
