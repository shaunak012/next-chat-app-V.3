"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
app.use((0, cors_1.default)());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 2e7
});
const users = [];
const rooms = [];
const initDataMaker = (username) => {
    let roomsOfUser = [];
    let messagesOfUser = [];
    let chatsOfUser = [];
    let friendReqOfUser = [];
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
            messages: room.messages.slice(lengthOfMessages <= 50 ? -1 * lengthOfMessages : -50),
            users: room.users,
        });
    }
    return {
        friendRequests: friendReqOfUser,
        rooms: messagesOfUser,
    };
};
io.on("connection", (socket) => {
    socket.on("user-connected", (username) => {
        socket.username = username;
        console.log(`${username} connected`);
        //mongo find user(un)
        let exists = false;
        for (let user of users) {
            if (user.username === username) {
                exists = true;
                break;
            }
        }
        if (exists) {
            //send data to un
            //put data                ↓ here
            socket.emit("initialdata", initDataMaker(username));
        }
        else {
            //else then create new user in mongo
            //else create user
            users.push({
                username: username,
                chats: [],
                friend_requests: [],
                socket_id: socket.id,
                socket: socket
            });
        }
    });
    socket.on("AddFriend", (data) => {
        for (let user of users) {
            if (user.username === data.userB) {
                user.friend_requests.push({ userA: data.userA, userB: data.userB });
                socket.to(user.socket_id).emit("AddFriendFromServer", data);
                break; //make this function such that it is only sent to User B
            }
        }
        //mongo add frnd req to other username
    });
    socket.on("AcceptFriendRequest", (data) => {
        socket.join(data.userA + data.userB);
        const room = {
            room_id: data.userA + data.userB,
            messages: [],
            users: [{ user: data.userA }, { user: data.userB }],
        };
        const chat = {
            room_id: data.userA + data.userB,
            userA: data.userA,
            userB: data.userB
        };
        for (let user of users) {
            if (user.username === data.userA) {
                user.socket.join(data.userA + data.userB);
                user.chats.push(chat);
                break;
            }
        }
        rooms.push(room);
        for (let user of users) {
            if (user.username === data.userB) {
                user.friend_requests = user.friend_requests.filter((request) => request.userA !== data.userA);
                user.chats.push(chat);
                break;
            }
        }
        io.to(data.userA + data.userB).emit("DMcreated", room);
        //mongo find both socket instance
        //create a room and add both to it
        //add room to mongo collection rooms
        //update both user's chats with room id and each other's username
    });
    socket.on("RejectFriendRequest", (data) => {
        for (let user of users) {
            if (user.username === data.userB) {
                user.friend_requests = user.friend_requests.filter((request) => request.userA !== data.userA);
                break;
            }
        }
        //remove user A from friendrequest
    });
    socket.on("send_message", (data) => {
        console.log(1);
        for (let room of rooms) {
            if (data.roomid === room.room_id) {
                room.messages.push({ username: data.username, message: data.message });
            }
        }
        //add message in room
        //send message to other's socketid
        io.sockets.to(data.roomid).emit("recieveMessage", data);
    });
    // from this point are things i plan to remove in the future
    socket.on("send_data", () => {
        socket.emit("initialdata", initDataMaker(socket.username));
    });
});
exports.default = { app, server };
