import React, { useId } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const id = useId();

  const create = () => {
    navigate(`/room/${id}`);
  };

  return <button onClick={create}>Create room</button>;
};

export default CreateRoom;
