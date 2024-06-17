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
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioElementsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

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

    newSocket.on(
      "audioData",
      ({ username, audioBlob }: { username: string; audioBlob: Blob }) => {
        if (audioElementsRef.current[username]) {
          const audioURL = URL.createObjectURL(audioBlob);
          audioElementsRef.current[username].src = audioURL;
          audioElementsRef.current[username].play();
        } else {
          const audioElement = new Audio();
          audioElement.src = URL.createObjectURL(audioBlob);
          audioElement.play();
          audioElementsRef.current[username] = audioElement;
        }
      }
    );

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [username, room]);

  useEffect(() => {
    if (micOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            audioStreamRef.current = stream;
            if (socket) {
              socket.emit("startAudio", { username });
              stream.getTracks().forEach((track) => {
                socket.emit("audioData", track);
                track.onended = () => {
                  socket.emit("stopAudio", { username });
                };
              });
            }
          })
          .catch((error) => {
            console.error("Error accessing microphone:", error);
          });
      } else {
        console.error("getUserMedia not supported on your browser!");
      }
    } else {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }

      if (socket) socket.emit("stopAudio", { username });
    }
  }, [micOn, socket, username]);

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
