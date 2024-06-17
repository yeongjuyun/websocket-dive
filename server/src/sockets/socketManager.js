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

    socket.on("join", (data) => {
      const { room, username } = data;
      socket.join(room);
      console.log(`User ${username} joined room: ${room}`);

      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push({ username, micOn: false, status: "online" });

      socket.data.username = username;
      socket.data.room = room;

      socket.to(room).emit("chat", {
        username: "System",
        message: `${username} 님이 입장하셨습니다.`,
      });

      io.to(room).emit("userList", rooms[room]);
    });

    socket.on("toggleMic", (data) => {
      const { username, micOn } = data;
      const room = socket.data.room;
      if (room) {
        const user = rooms[room].find((user) => user.username === username);
        if (user) user.micOn = micOn;

        io.to(room).emit("userList", rooms[room]);
      }
    });

    socket.on("chat", (data) => {
      console.log(`message - ${data.username}: ${data.message}`);

      io.to(data.room).emit("chat", {
        username: data.username,
        message: data.message,
      });
    });

    socket.on("disconnect", () => {
      const username = socket.data.username;
      const room = socket.data.room;

      if (room && username) {
        const user = rooms[room].find((user) => user.username === username);
        if (user) user.status = "offline";

        io.to(room).emit("chat", {
          username: "System",
          message: `${username} 님이 나가셨습니다.`,
        });

        io.to(room).emit("userList", rooms[room]);
      }

      console.log(`User ${username} disconnected from room: ${room}`);
    });
  });
};

module.exports = {
  initSocket,
};
