const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "voice") {
    } else if (parsedMessage.type === "text") {
      // 클라이언트로부터 받은 메시지를 다른 클라이언트에게 브로드캐스트
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          console.log(`Received message: ${parsedMessage}`);
          client.send(parsedMessage.data);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
