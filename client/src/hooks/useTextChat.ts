import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useChat = ({ username, room }: { username: string; room: string }) => {
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    newSocket.emit("joinRoom", { room, username });

    newSocket.on("chat", (msg: { username: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (username: string) => {
    if (message.trim() !== "" && socket) {
      socket.emit("chat", { room, username, message });
      setMessage("");
    }
  };

  return { messages, message, setMessage, sendMessage };
};

export default useChat;
