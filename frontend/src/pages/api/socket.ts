import { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket) {
    if (res.socket.server.io) {
      console.log("Socket is already running.");
    } else {
      console.log("Socket is initializing...");
      
      const io = new IOServer(res.socket.server);
      res.socket.server.io = io;
      const users:{
        [index:string]:string
      } = {};
      const others:string[] = [];

      io.on("connection", (socket) => {
        socket.on("new-user-joined", (name:string) => {
          socket.join("global");
          others.push("global");
          users[socket.id] = name;
          // would'nt it be better to do this users[name] = socket.id;
          socket.broadcast.to("global").emit(`user-joined`, users[socket.id]);
          console.log(name, " : connected");
        });

        socket.on(`send`, (data) => {
          // socket.broadcast
          io.to(data.currentChat).emit("recieve", {
            message: data.message,
            name: users[socket.id],
          });
        });
        socket.on("join-old-chat", (chatName) => {
          others.map((chats) => {
            socket.leave(chats);
          });
          socket.join(chatName);
          socket.broadcast.to(chatName).emit(`user-joined`, users[socket.id]);
        });
        socket.on("join-new-group", (name) => {
          socket.broadcast.to(name).emit(`user-joined`, users[socket.id]);
          others.push(name);
          others.map((chats) => {
            socket.leave(chats);
          });
          socket.join(name);
          socket.emit("clear");
        });
        socket.on("disconnect", () => {
          socket.broadcast
            .to("global")
            .emit("user-disconnected", users[socket.id]);
          console.log(users[socket.id], ": disconnected");
          delete users[socket.id];
        });
      });
    }
  }

  res.end();
};

export default SocketHandler;
