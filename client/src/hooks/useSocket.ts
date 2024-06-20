import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { Instance } from "simple-peer";

interface Message {
  username: string;
  message: string;
}

interface User {
  id: string;
  username: string;
  micOn: boolean;
}

const useSocket = ({
  username,
  roomId,
}: {
  username: string;
  roomId: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [peers, setPeers] = useState<Instance[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const peersRef = useRef<{ peerID: string; peer: Instance }[]>([]);
  const streamRef = useRef<MediaStream | undefined>(undefined);

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");
    socketRef.current.on("connect", () => {
      initMediaConnection();
    });

    socketRef.current.on("chat", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on("users", (users: User[]) => {
      setUsers(users);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, roomId]);

  const initMediaConnection = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        streamRef.current = stream;

        if (socketRef.current) {
          socketRef.current?.emit("join", { roomId, username });
          socketRef.current.on("all users", getUsers);
          socketRef.current.on("user joined", joinUser);
          socketRef.current.on("receiving returned signal", getSignal);
          socketRef.current.on("disconnect user", deleteUser);
        }
      });
  };

  const createPeer = (
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (signal) => {
      if (socketRef.current) {
        socketRef.current.emit("sending signal", {
          userToSignal,
          callerID,
          signal,
        });
      }
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
    });

    return peer;
  };

  const addPeer = (
    incomingSignal: string,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current?.emit("returning signal", {
        signal,
        callerID,
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

  const joinUser = (payload: { callerID: string; signal: any }) => {
    const peer = addPeer(payload.signal, payload.callerID, streamRef.current!);
    peersRef.current.push({
      peerID: payload.callerID,
      peer,
    });

    setPeers((peers) => [...peers, peer]);
  };

  const getUsers = (users: User[]) => {
    const peers: any[] = [];
    users.forEach((user) => {
      const peer = createPeer(
        user.id,
        socketRef.current?.id!,
        streamRef.current!
      );
      peersRef.current.push({
        peerID: user.id,
        peer,
      });
      peers.push(peer);
    });
    setPeers(peers);
  };

  const getSignal = (payload: { id: string; signal: any }) => {
    const item = peersRef.current.find((p) => p.peerID === payload.id);
    item?.peer.signal(payload.signal);
  };

  const deleteUser = (payload: { userId: string }) => {
    const remainingPeers = peersRef.current.filter((p) => {
      if (p.peerID === payload.userId) {
        p.peer.destroy();
        return false;
      }
      return true;
    });

    peersRef.current = remainingPeers;
    setPeers(remainingPeers.map((p) => p.peer));
  };

  const sendMessage = (username: string, message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("chat", { roomId, username, message });
    }
  };

  const toggleMic = () => {
    if (socketRef.current) {
      const newMicStatus = !micOn;
      setMicOn(newMicStatus);
      socketRef.current.emit("toggleMic", { username, micOn: newMicStatus });
    }
  };

  return {
    users,
    peers,
    micOn,
    messages,
    userVideo,
    sendMessage,
    toggleMic,
  };
};

export default useSocket;
