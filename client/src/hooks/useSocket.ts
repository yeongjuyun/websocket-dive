import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  username: string;
  message: string;
}

interface User {
  username: string;
  micOn: boolean;
  status: string;
}

const useChat = ({ username, room }: { username: string; room: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
      newSocket.emit("join", { room, username });
    });

    newSocket.on("chat", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("userList", (userList: User[]) => {
      setUsers(userList);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [username, room]);

  const sendMessage = (username: string) => {
    if (socket && message.trim() !== "") {
      socket.emit("chat", { room, username, message });
      setMessage("");
    }
  };

  const toggleMic = () => {
    if (socket) {
      const newMicStatus = !micOn;
      setMicOn(newMicStatus);
      socket.emit("toggleMic", { username, micOn: newMicStatus });
    }
  };

  return {
    messages,
    message,
    users,
    micOn,
    setMessage,
    sendMessage,
    toggleMic,
  };
};

export default useChat;
