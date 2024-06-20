import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";

const Room: React.FC = () => {
  const { roomId } = useParams();
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            className="border border-black px-4 py-2"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-4 py-2 text-white">
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {roomId && <ChatPanel username={username} roomId={roomId} />}
    </div>
  );
};

export default Room;
