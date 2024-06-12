// App.tsx 파일

import React from "react";
import TextChat from "./components/TextChat";
import VoiceChat from "./components/VoiceChat";

const App: React.FC = () => {
  return (
    <div className="App">
      <TextChat />
      <VoiceChat />
    </div>
  );
};

export default App;
