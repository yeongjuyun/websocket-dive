import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

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
  const [peers, setPeers] = useState<any[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const peersRef = useRef<any[]>([]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    socketRef.current.on("connect", () => {
      if (socketRef.current) {
        socketRef.current.emit("join", { roomId, username });

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
            }

            socketRef.current?.on("all users", (users: User[]) => {
              const peers: any[] = [];
              users.forEach((user) => {
                const peer = createPeer(user.id, socketRef.current?.id, stream);
                peersRef.current.push({
                  peerID: user.id,
                  peer,
                });
                peers.push(peer);
              });
              setPeers(peers);
            });

            socketRef.current?.on("user joined", (payload) => {
              const peer = addPeer(payload.signal, payload.callerID, stream);
              peersRef.current.push({
                peerID: payload.callerID,
                peer,
              });

              setPeers((peers) => [...peers, peer]);
            });

            socketRef.current?.on("receiving returned signal", (payload) => {
              const item = peersRef.current.find(
                (p) => p.peerID === payload.id
              );
              item.peer.signal(payload.signal);
            });
          });
      }
    });

    socketRef.current.on("chat", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on("users", (userList: User[]) => {
      setUsers(userList);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, roomId]);

  const createPeer = (userToSignal: any, callerID: any, stream: any) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
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

    return peer;
  };

  const addPeer = (incomingSignal: any, callerID: any, stream: any) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current?.emit("returning signal", {
        signal,
        callerID,
      });
    });

    peer.signal(incomingSignal);

    return peer;
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
    messages,
    users,
    micOn,
    sendMessage,
    toggleMic,
    userVideo,
    peers,
  };
};

export default useSocket;
