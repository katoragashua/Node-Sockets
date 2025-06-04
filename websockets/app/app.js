const socket = new WebSocket("ws://localhost:3000");

const sendMessage = (e) => {
  e.preventDefault();
  const input = document.querySelector("input");
  const message = input.value;
  console.log(message);

  if (message) {
    socket.send(message);
    input.value = "";
  }
  input.focus();
};

document.querySelector("form").addEventListener("submit", sendMessage);

// Event listener for receiving or listening to messages from the server
socket.addEventListener("message", (e) => {
  console.log(e);
  const { data } = e;

  console.log(data);
  const li = document.createElement("li");
  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});
