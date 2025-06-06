// const io = require("socket.io")
// console.log(io);

const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"], // if your backend is hosted on a different domain, you'd have give the frontend access
    //   methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`); // Broadcast the message to all connected clients
  });
});

httpServer.listen(3500, () => {
  console.log("Server is running on port " + 3500);
});


