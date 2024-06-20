const { Server } = require("socket.io");

const rooms = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", ({ roomId, username }) => {
      socket.join(roomId);

      socket.data.roomId = roomId;
      socket.data.username = username;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      rooms[roomId].push({
        id: socket.id,
        username: username,
        micOn: false,
      });

      const usersExceptMe = rooms[roomId].filter(
        (user) => user.id !== socket.id
      );

      io.to(socket.id).emit("all users", usersExceptMe);

      io.to(roomId).emit("users", rooms[roomId]);
    });

    socket.on("sending signal", (payload) => {
      io.to(payload.calleeId).emit("user joined", {
        callerId: payload.callerId,
        signal: payload.signal,
      });
    });

    socket.on("returning signal", (payload) => {
      io.to(payload.callerId).emit("receiving returned signal", {
        calleeId: socket.id,
        signal: payload.signal,
      });
    });

    socket.on("toggleMic", (data) => {
      const { username, micOn } = data;
      const roomId = socket.data.roomId;

      if (roomId) {
        const user = rooms[roomId].find((user) => user.username === username);
        if (user) user.micOn = micOn;

        io.to(roomId).emit("users", rooms[roomId]);
      }
    });

    socket.on("chat", (data) => {
      io.to(data.roomId).emit("chat", {
        username: data.username,
        message: data.message,
      });
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;

      let room = rooms[roomId];
      if (room) {
        room = room.filter((user) => user.id !== socket.id);
        rooms[roomId] = room;
        io.to(roomId).emit("users", rooms[roomId]);
        io.to(roomId).emit("disconnect user", { userId: socket.id });
      }
    });
  });
};

module.exports = {
  initSocket,
};
