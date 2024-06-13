import React, { useState } from "react";
import TextChat from "./components/TextChat";
import VoiceChat from "./components/VoiceChat";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { username };
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <TextChat />
        <VoiceChat />
      </div>
    );
  }

  return (
    <div className="App">
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default App;
