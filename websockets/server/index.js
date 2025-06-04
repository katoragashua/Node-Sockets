const ws = require("ws");
console.log(ws);
// const WebSocket = require("ws"); // Alternative way to import the ws module
const server = new ws.Server({ port: "3000" });

server.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("Received message:", message);
    
    
    const b = Buffer.from(message);
    console.log(b.toString());
    socket.send(`${message}`); // Interpolating the message object turn it to a string
    // socket.send(message.toString());
    // socket.send(String(message));
  });
});
