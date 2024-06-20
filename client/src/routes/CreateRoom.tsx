import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();

  const create = () => {
    navigate(`/room/${uuidv4()}`);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <button onClick={create} className="bg-blue-600 px-4 py-2 text-white">
        Create room
      </button>
    </div>
  );
};

export default CreateRoom;
