import { useEffect, useRef } from "react";
import { Peer } from "../types/chat";

const Video = ({ peer }: { peer: Peer }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (peer) {
      peer.instance.on("stream", (stream: MediaStream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    }
  }, []);

  return <video ref={videoRef} playsInline autoPlay className="h-2/5 w-1/2" />;
};

export default Video;
