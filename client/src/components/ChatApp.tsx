import React, { useState } from "react";
import TextChat from "./TextChat";
import VoiceChat from "./VoiceChat";

const ChatApp: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <TextChat username={username} />
      {/* <VoiceChat /> */}
    </div>
  );
};

export default ChatApp;
