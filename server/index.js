const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://172.30.10.105:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://172.30.10.105:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = "your_jwt_secret";

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send("Username is required");
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.send("Login successful");
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

app.get("/protected", authenticateToken, (req, res) => {
  res.send(`Hello ${req.user.username}, this is a protected route.`);
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (data) => {
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

  socket.on("signal", (data) => {
    const { signal, receiver } = data;

    io.to(receiver).emit("signal", { signal, sender: socket.data.username });
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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
