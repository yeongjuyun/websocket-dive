import React, { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket";

const Chat: React.FC<{ username: string }> = ({ username }) => {
  const [room, setRoom] = useState("default");
  const { messages, message, users, setMessage, sendMessage, toggleMic } =
    useSocket({
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
      <h1>WebSocket Chat: {room}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            flex: "1",
            marginRight: "10px",
          }}
        >
          <ul
            style={{
              listStyleType: "none",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              height: "300px",
              padding: "10px",
              margin: 0,
            }}
          >
            {users.map((user, index) => {
              return (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {user.username} ({user.status})
                  </span>
                  <button
                    onClick={() => user.username === username && toggleMic()}
                    style={{ marginLeft: "10px" }}
                  >
                    {user.micOn ? "🔊" : "🔇"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          ref={chatboxRef}
          id="chatbox"
          style={{
            flex: "2",
            height: "300px",
            overflowY: "scroll",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
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

export default Chat;
