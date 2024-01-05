"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const chat_1 = __importDefault(require("./routes/chat"));
const socket_1 = __importDefault(require("./routes/socket"));
const app = socket_1.default.app;
const server = socket_1.default.server;
app.use("/rooms", chat_1.default);
server.listen(process.env.PORT, () => {
    console.log("SERVER RUNNING");
});
