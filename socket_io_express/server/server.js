// const { Server } = require("socket.io");
// const { createServer } = require("http");
// const path = require("path");

// const express = require("express");
// const app = express();
// app.use(express.static(path.join(__dirname, "public")));
// const httpServer = createServer();
// httpServer.on("request", app);

// const io = new Server(httpServer, {
//   cors: {
//     origin:
//       process.env.NODE_ENV === "production"
//         ? false
//         : ["http://localhost:5500", "http://127.0.0.1:5500"],
//     //   methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log(`User ${socket.id} connected`);

//   // Single client/user that connects
//   socket.emit("message", "Welcome to the chat app!");

//   // All connected clients/users except the one that connects
//   socket.broadcast.emit(
//     "message",
//     `${socket.id.substring(0, 5)}: joined the chat`
//   );

//   // Listening for a message event
//   socket.on("message", (data) => {
//     console.log(data);

//     // Broadcast the message to all connected clients/users including the one that sent it
//     io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
//   });

//   // Send a message to all others when a user disconnects
//   socket.on("disconnect", () => {
//     socket.broadcast.emit("message", `${socket.id.substring(0, 5)}: left the chat`);
//   });

//   // Listen for activity
//   socket.on("activity", (name) => {
//     socket.broadcast.emit("activity", name);
//   })
// });



// httpServer.listen(3500, () => {
//   console.log("Server is running on port " + 3500);
// });

const {Server} = require("socket.io");
const {createServer} = require("http");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3500;

app.use(express.static(path.join(__dirname, "public")));
const httpServer = createServer();
httpServer.on("request", app);

const io = new Server(httpServer)

io.on("connection", socket => {
  console.log(`User ${socket.id} connected`);

  // Emit or send a message to only the client/user that connects
  socket.emit("message", "Welcome to the chat app!");

  // Send to all connected clients/users except the one that connects
  socket.broadcast.emit("message", `${socket.id.substring(0, 5)}: joined the chat`);

  // Listening for a message event
  socket.on("message", data => {
    console.log(data);

    // Broadcast the message to all connected clients/users including the one that sent it
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  // Send a message to all others when a user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("message", `${socket.id.substring(0, 5)}: left the chat`);
  });

  // Listen for an activity event
  socket.on("activity", name => {
    // Broadcast the activity to all connected clients/users except the one that sent it
    socket.broadcast.emit("activity", name);
  });
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});