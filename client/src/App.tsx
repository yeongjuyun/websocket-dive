import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./routes/Room";
import CreateRoom from "./routes/CreateRoom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={CreateRoom}></Route>
        <Route path="/room/:roomId" Component={Room}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
