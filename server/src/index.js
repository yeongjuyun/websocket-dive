const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { initSocket } = require("./sockets/socketManager");

const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

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

// Routes
app.use("/auth", authRoutes);

// Initialize Socket
initSocket(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
