import { Instance } from "simple-peer";

export interface Peer {
  id: string;
  instance: Instance;
}

export interface Message {
  username: string;
  message: string;
}
