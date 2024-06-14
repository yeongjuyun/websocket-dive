import React, { useEffect, useRef, useState } from "react";
import useTextChat from "../hooks/useTextChat";

const TextChat: React.FC<{ username: string }> = ({ username }) => {
  const [room, setRoom] = useState("default");
  const { messages, message, setMessage, sendMessage } = useTextChat({
    username,
    room,
  });
  const chatboxRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(username);
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h1>WebSocket Text Chat</h1>
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
            marginRight: "10px",
          }}
        />
      </div>
      <div
        ref={chatboxRef}
        id="chatbox"
        style={{
          width: "100%",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              padding: "8px",
              margin: "4px 0",
              borderRadius: "4px",
              backgroundColor: "#e0e0e0",
            }}
          >
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            outline: "none",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TextChat;
