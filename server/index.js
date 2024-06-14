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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
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

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (data) => {
    const { room, username } = data;
    socket.join(room);
    console.log(`User ${username} joined room: ${room}`);

    socket.data.username = username;
    socket.data.room = room;

    socket.to(room).emit("chat", {
      username: "System",
      message: `${username} 님이 입장하셨습니다.`,
    });
  });

  socket.on("chat", (data) => {
    console.log(`message: ${data.username}: ${data.message}`);
    io.to(data.room).emit("chat", {
      username: data.username,
      message: data.message,
    });
  });

  socket.on("signal", (data) => {
    io.to(data.room).emit("signal", data);
  });

  socket.on("disconnect", () => {
    const username = socket.data.username;
    const room = socket.data.room;

    if (room && username) {
      io.to(room).emit("chat", {
        username: "System",
        message: `${username} 님이 나가셨습니다.`,
      });
    }

    console.log(`User ${username} disconnected from room: ${room}`);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
