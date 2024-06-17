import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useChat = ({ username, room }: { username: string; room: string }) => {
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<
    { username: string; micOn: boolean; status: string }[]
  >([]);
  const [micOn, setMicOn] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io("http://172.30.10.105:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
      newSocket.emit("joinRoom", { room, username });
    });

    newSocket.on("chat", (msg: { username: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on(
      "userList",
      (userList: { username: string; micOn: boolean; status: string }[]) => {
        setUsers(userList);
      }
    );

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [username, room]);

  const sendMessage = (username: string) => {
    if (message.trim() !== "" && socket) {
      socket.emit("chat", { room, username, message });
      setMessage("");
    }
  };

  const toggleMic = () => {
    if (socket) {
      const newMicStatus = !micOn;
      socket.emit("toggleMic", { username, micOn: newMicStatus });
      setMicOn(newMicStatus);
    }
  };

  return {
    messages,
    message,
    users,
    setMessage,
    sendMessage,
    toggleMic,
  };
};

export default useChat;
