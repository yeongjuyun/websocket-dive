import React from "react";
import useChat from "../hooks/useTextChat";
import "../styles/Chat.css";

const Chat: React.FC = () => {
  const { messages, message, setMessage, sendMessage } = useChat();

  return (
    <div className="Chat">
      <h1>WebSocket Chat</h1>
      <div id="chatbox" className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        id="messageInput"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
