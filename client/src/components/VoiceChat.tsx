import useVoiceChat from "../hooks/useVoiceChat";

const VoiceChat: React.FC = () => {
  const { startRecording, stopRecording, connectToServer } = useVoiceChat();

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={connectToServer}>Connect to Server</button>
    </div>
  );
};

export default VoiceChat;
