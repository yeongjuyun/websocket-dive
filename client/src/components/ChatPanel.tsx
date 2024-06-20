import React from "react";
import useSocket from "../hooks/useSocket";
import Video from "./Video";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

const ChatPanel: React.FC<{ roomId: string; username: string }> = ({
  roomId,
  username,
}) => {
  const { users, peers, messages, userVideo, sendMessage, toggleMic } =
    useSocket({ username, roomId });

  const VideoTestComponent = () => {
    return (
      <div className="mt-4 hidden">
        <video
          muted
          ref={userVideo}
          autoPlay
          playsInline
          className="h-2/5 w-1/2"
        />
        {peers.map((peer, index) => (
          <Video key={index} peer={peer} />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-lg border border-gray-300 bg-white p-5 shadow-md">
      <h1 className="mb-4 text-xl font-bold">RoomId: {roomId}</h1>
      <div className="flex w-full flex-col gap-2">
        <UserList users={users} username={username} onClick={toggleMic} />
        <ChatBox
          messages={messages}
          username={username}
          sendMessage={sendMessage}
        />
        {VideoTestComponent()}
      </div>
    </div>
  );
};

export default ChatPanel;
