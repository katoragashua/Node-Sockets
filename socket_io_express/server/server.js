const { Server } = require("socket.io");
const { createServer } = require("http");
const path = require("path");

const express = require("express");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
    //   methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Single client/user that connects
  socket.emit("message");

  // All connected clients/users except the one that connects
  socket.broadcast.emit(
    "message",
    `${socket.id.substring(0, 5)}: joined the chat`
  );

  // Listening for a message event
  socket.on("message", (data) => {
    console.log(data);

    // Broadcast the message to all connected clients/users including the one that sent it
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  // Send a message to all others when a user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("message", `${socket.id.substring(0, 5)}: left the chat`);
  });

  // Listen for activity
  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  })
});



httpServer.listen(3500, () => {
  console.log("Server is running on port " + 3500);
});
