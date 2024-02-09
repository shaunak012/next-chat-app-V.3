import { Socket } from "socket.io";

// had to remove this from front of here ↓ <DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
export interface newSocket extends Socket {
  username?: string;
}
export interface user {
  username: string;
  chats: chat[];
  friend_requests: friend_req[];
  socket_id: string;
  socket: newSocket;
}
export interface chat {
  room_id: string; //make this a reference in mongo
  userA: string;
  userB: string;
}
export interface friend_req {
  userA: string;
  userB: string;
}

export interface room {
  room_id: string;
  messages: message[];
  users: username[];
  secret:string;
}
export interface message {
  username: string;
  message: string;
}
interface username {
  user: string;
}

export interface data {
  friendRequests: friend_req[];
  rooms: room[];
}
