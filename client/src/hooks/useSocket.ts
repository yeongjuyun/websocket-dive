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

const useChat = ({
  username,
  roomId,
}: {
  username: string;
  roomId: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    socketRef.current.on("connect", () => {
      console.log("Connected to the server");
      if (socketRef.current) {
        socketRef.current.emit("join", { roomId, username });
      }
    });

    socketRef.current.on("chat", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on("userList", (userList: User[]) => {
      setUsers(userList);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, roomId]);

  const sendMessage = (username: string, message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("chat", { roomId, username, message });
    }
  };

  const toggleMic = () => {
    if (socketRef.current) {
      const newMicStatus = !micOn;
      setMicOn(newMicStatus);
      socketRef.current.emit("toggleMic", { username, micOn: newMicStatus });
    }
  };

  return {
    messages,
    users,
    micOn,
    sendMessage,
    toggleMic,
  };
};

export default useChat;
