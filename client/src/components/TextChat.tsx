import React from "react";
import useChat from "../hooks/useTextChat";

const Chat: React.FC = () => {
  const { messages, message, setMessage, sendMessage } = useChat();

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
      <h1>WebSocket Chat</h1>
      <div
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
            {msg}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <input
          type="text"
          id="messageInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px 0 0 4px",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "0 4px 4px 0",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            outline: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
