import Peer from "simple-peer";
import { Socket } from "socket.io-client";
import { SOCKET_EVENT } from "../constants/socket";

export const createPeer = (
  socket: Socket,
  stream: MediaStream,
  callerId: string,
  userToSignal: string
) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: stream,
  });

  peer.on("signal", (signal) => {
    socket.emit(SOCKET_EVENT.media.sendSignal, {
      userToSignal,
      callerId,
      signal,
    });
  });

  peer.on("error", (err) => {
    console.error("Peer connection error:", err);
  });

  peer.on("close", () => {
    console.log("Peer connection closed");
  });

  return peer;
};

export const addPeer = (
  socket: Socket,
  incomingSignal: string,
  callerId: string,
  stream: MediaStream
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: stream,
  });

  peer.on("signal", (signal) => {
    socket.emit(SOCKET_EVENT.media.returnSignal, {
      signal,
      callerId,
    });
  });

  peer.signal(incomingSignal);

  peer.on("error", (err) => {
    console.error("Peer connection error:", err);
  });

  peer.on("close", () => {
    console.log("Peer connection closed");
  });

  return peer;
};

export const changeMediaTrackEnabled = (
  stream: MediaStream,
  enabled: boolean
) => {
  const audioTrack = stream.getAudioTracks()[0];
  const videoTrack = stream.getVideoTracks()[0];
  if (audioTrack) audioTrack.enabled = enabled;
  if (videoTrack) videoTrack.enabled = enabled;
};
