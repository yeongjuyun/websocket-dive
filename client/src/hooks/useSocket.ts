import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { User } from "../types/room";
import { Message, Peer } from "../types/chat";
import { SOCKET_EVENT } from "../constants/socket";
import { addPeer, changeMediaTrackEnabled, createPeer } from "../utils/media";

const useSocket = (props: { username: string; roomId: string }) => {
  const { username, roomId } = props;

  const [users, setUsers] = useState<User[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = useRef<Socket>(io("http://localhost:8080"));
  const peersRef = useRef<Peer[]>([]);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    socketRef.current.on("connect", initMediaConnection);
    socketRef.current.on(SOCKET_EVENT.chat.send, getChatMessages);
    socketRef.current.on(SOCKET_EVENT.chat.users, getUsers);
  }, [username, roomId]);

  const initMediaConnection = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current!.srcObject = stream;
        streamRef.current = stream;
        changeMediaTrackEnabled(streamRef.current, false);

        socketRef.current.emit(SOCKET_EVENT.join, { roomId, username });
        socketRef.current.on(SOCKET_EVENT.media.users, getPeers);
        socketRef.current.on(SOCKET_EVENT.media.offer, joinUser);
        socketRef.current.on(SOCKET_EVENT.media.accept, getSignal);
        socketRef.current.on(SOCKET_EVENT.media.leave, deleteUser);
      });
  };

  const getUsers = (users: User[]) => {
    setUsers(users);
  };

  const getChatMessages = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const joinUser = (payload: { callerId: string; signal: any }) => {
    const peer = addPeer(
      socketRef.current,
      payload.signal,
      payload.callerId,
      streamRef.current!
    );

    const newPeer = { id: payload.callerId, instance: peer };
    peersRef.current.push(newPeer);
    setPeers((peers) => [...peers, newPeer]);
  };

  const getPeers = (users: User[]) => {
    const peers: Peer[] = [];
    users.forEach((user) => {
      const peer = createPeer(
        socketRef.current,
        streamRef.current!,
        socketRef.current.id!,
        user.id
      );
      const newPeer = { id: user.id, instance: peer };
      peersRef.current.push(newPeer);
      peers.push(newPeer);
    });
    setPeers(peers);
  };

  const getSignal = (payload: { calleeId: string; signal: any }) => {
    const item = peersRef.current.find((p) => p.id === payload.calleeId);
    if (item) item.instance.signal(payload.signal);
  };

  const deleteUser = (payload: { userId: string }) => {
    const peers = peersRef.current.filter((peer) => {
      if (peer.id === payload.userId) {
        peer.instance.destroy();
        return false;
      }
      return true;
    });

    peersRef.current = peers;
    setPeers(peers);
  };

  const sendMessage = (username: string, message: string) => {
    socketRef.current.emit(SOCKET_EVENT.chat.send, {
      roomId,
      username,
      message,
    });
  };

  const toggleMic = () => {
    const mediaEnabled = !micOn;
    const payload = { username, micOn: mediaEnabled };
    socketRef.current.emit(SOCKET_EVENT.chat.changeMicStatus, payload);
    setMicOn(mediaEnabled);

    if (streamRef.current) {
      changeMediaTrackEnabled(streamRef.current, mediaEnabled);
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
