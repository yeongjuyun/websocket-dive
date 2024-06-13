import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    newSocket.on("chat", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "" && socket) {
      socket.emit("chat", message);
      setMessage(""); // 메시지 전송 후 입력 필드를 비움
    }
  };

  return { messages, message, setMessage, sendMessage };
};

export default useChat;
