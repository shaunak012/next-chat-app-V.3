import express from "express";
const app = express();
import cors from "cors";
import { Server} from "socket.io";
import { createServer } from "http";

import { user,room , data,friend_req,chat, newSocket} from "../types/socket_types";

app.use(cors());
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 2e7
});



const users:user[]=[];
const rooms:room[]=[];


const initDataMaker = (username:string):data => {
  let roomsOfUser: room[] = [];
  let messagesOfUser:room[] = [];
  let chatsOfUser: chat[] = [];
  let friendReqOfUser: friend_req[] = [];
  
  for (let user of users) {
    if (user.username === username) {
      chatsOfUser = user.chats;
      friendReqOfUser = user.friend_requests;
      break;
    }
  }
  for (let room of rooms) {
    for (let chat of chatsOfUser) {
      if (chat.room_id === room.room_id) {
        roomsOfUser.push(room);
      }
    }
  }
  //if un exists get chats and latest 50 messages and friend requests
  for (let room of roomsOfUser) {
    let lengthOfMessages = room.messages.length;
    messagesOfUser.push({
      room_id: room.room_id,
      messages: room.messages.slice(
        lengthOfMessages <= 50 ? -1 * lengthOfMessages : -50
      ),
      users: room.users,
      secret: room.secret,
    });
  }
  return {
    friendRequests: friendReqOfUser,
    rooms: messagesOfUser,
  };
};

function generateRandomNumber() {
    return Math.floor(Math.random()*100)
}

io.on("connection", (socket:newSocket) => {
    socket.on("user-connected",(username:string)=>{
      socket.username=username;
      console.log(`${username} connected`)
      //mongo find user(un)
      let exists=false;
      for (let user of users) {
        if (user.username === username) {
          exists = true;
          break;
        }
      }
      if(exists){
        //send data to un
        //put data                ↓ here
        socket.emit("initialdata",initDataMaker(username))
      }else{
        //else then create new user in mongo
        //else create user
        users.push({
          username:username,
          chats:[],
          friend_requests:[],
          socket_id:socket.id,
          socket:socket
        })
      }
    })

    socket.on("AddFriend", (data:friend_req)=> {
      for(let user of users){
        if(user.username===data.userB){
          user.friend_requests.push({userA:data.userA,userB:data.userB})
          socket.to(user.socket_id).emit("AddFriendFromServer",data);
          break;//make this function such that it is only sent to User B
        }
      }
      //mongo add frnd req to other username
    });

    socket.on("AcceptFriendRequest",(data:friend_req)=>{
      socket.join(data.userA+data.userB);
      const room:room = {
        room_id: data.userA + data.userB,
        messages: [],
        users: [{ user: data.userA }, { user: data.userB }],
        secret:generateRandomNumber(),
      };
      const chat:chat = {
        room_id: data.userA + data.userB,
        userA:data.userA,
        userB:data.userB
      };
      for (let user of users) {
        if (user.username === data.userA) {
          user.socket.join(data.userA+data.userB);
          user.chats.push(chat);
          break;
        }
      }
      rooms.push(room);
      for (let user of users) {
        if (user.username === data.userB) {
          user.friend_requests=user.friend_requests.filter((request)=>request.userA!==data.userA);
          user.chats.push(chat);
          break;
        }
      }
      io.to(data.userA+data.userB).emit("DMcreated",room)
        //mongo find both socket instance
        //create a room and add both to it
        //add room to mongo collection rooms
        //update both user's chats with room id and each other's username

    })

    socket.on(
      "RejectFriendRequest",
      (data:friend_req) => {
        for (let user of users) {
          if (user.username === data.userB) {
            user.friend_requests = user.friend_requests.filter(
              (request) => request.userA !== data.userA
            );
            break;
          }
        }
        //remove user A from friendrequest
      }
    );

    socket.on(
      "send_message",
      (data: { message: string; roomid: string; username: string }) => {
        console.log(1);
        for(let room of rooms){
          if(data.roomid===room.room_id){
            room.messages.push({username:data.username,message:data.message})
          }
        }
        //add message in room
        //send message to other's socketid
        io.sockets.to(data.roomid).emit("recieveMessage",data);
      }
    );

// from this point are things i plan to remove in the future
  socket.on("send_data",()=>{
    socket.emit("initialdata", initDataMaker(socket.username as string));
  });


});

export default { app, server };
