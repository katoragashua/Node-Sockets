const { Server } = require("socket.io");
const { createServer } = require("http");
const path = require("path");

const express = require("express");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
const httpServer = createServer(app);

const ADMIN = "Admin";

const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

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
  socket.emit("message", buildMsg(ADMIN, "Welcome to Chat App"));

  socket.on("joinRoom", ({ room, name }) => {
    const prevRoom = getUser(socket.id)?.room;
    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit("message", buildMsg(ADMIN, `{name} has left room`));
    }

    // This activates a user and sets the UsersState
    const user = activateUser(name, socket.id, room);

    // This updates the list of users in the room the user leaves
    if (prevRoom) {
      io.to(prevRoom).emit("userList", { users: getUsersInRoom(prevRoom) });
    }

    // Join the room
    socket.join(user.room);

    // Message to user
    socket.emit(
      "message",
      buildMsg(ADMIN, `You have joined ${user.room} chat room.`)
    );

    // Message to all other users in the room
    socket.broadcast.emit(
      "message",
      buildMsg(ADMIN, `${user.name} has joined the room.`)
    );

    // Update the list of users in the room the user joins
    io.to(user.room).emit("userList", { users: getUsersInRoom(user.room) });

    // Get all active rooms
    const allRooms = getAllActiveRooms();
    io.emit("roomList", { rooms: allRooms });
  });

  // Send a message to all others when a user disconnects
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);
    if (user) {
      socket.leave(user.room);
      io.to(user.room).emit(
        "message",
        buildMsg(ADMIN, `{name} has left the room`)
      );
      io.to(user.room).emit("userList", { users: getUsersInRoom(user.room) });
      // Get all active rooms
      const allRooms = getAllActiveRooms();
      io.emit("roomList", { rooms: allRooms });
    }
    console.log(`User ${socket.id} disconnected`);
  });

  // Listening for a message event
  socket.on("message", ({name, text}) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  // Listen for activity
  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });
});

httpServer.listen(3500, () => {
  console.log("Server is running on port " + 3500);
});

const buildMsg = (name, text) => {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
};

// User functions
const activateUser = (name, id, room) => {
  const user = { name, id, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
};

const userLeavesApp = (id) => {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
};

const getUser = (id) => {
  return UsersState.users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return UsersState.users.filter((user) => user.room === room);
};

const getAllActiveRooms = () => {
  return [...new Set(UsersState.users.map((user) => user.room))];
};
