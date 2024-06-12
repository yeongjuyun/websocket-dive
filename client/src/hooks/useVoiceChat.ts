import React, { useState, useRef } from "react";

const useVoiceChat = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioRecorder = useRef<MediaRecorder | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      audioRecorder.current = new MediaRecorder(stream);
      audioRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          const audioBlob = new Blob([e.data], { type: "audio/wav" });
          sendVoiceMessage(audioBlob);
        }
      };
      audioRecorder.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (audioRecorder.current && audioRecorder.current.state === "recording") {
      audioRecorder.current.stop();
      audioStream?.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
  };

  const connectToServer = () => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connected to the server");
    };

    ws.current.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  const sendVoiceMessage = (audioBlob: Blob) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(audioBlob);
    }
  };

  return {
    startRecording,
    stopRecording,
    connectToServer,
  };
};

export default useVoiceChat;
