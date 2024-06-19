import { useState } from "react";
import Chat from "../components/Chat";
import { useParams } from "react-router-dom";

const Room: React.FC = () => {
  const { roomId } = useParams();

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
      {roomId && (
        <div>
          <Chat username={username} roomId={roomId} />
        </div>
      )}
    </div>
  );
};

export default Room;
