import { useEffect, useRef, useState } from "react";

const useChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connected to the server");
    };

    ws.current.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.current.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const chatMessage = { type: "text", data: message };
      ws.current?.send(JSON.stringify(chatMessage));
      setMessage(""); // 메시지 전송 후 입력 필드를 비움
    }
  };

  return { messages, message, setMessage, sendMessage };
};

export default useChat;
