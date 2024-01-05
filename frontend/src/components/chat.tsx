import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
import style from "@/styles/chat.module.css";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

type MessageType = {
  sender: string; // Assuming sender is a string, you can adjust the type accordingly
  content: string; // Adjust the type of content as needed
};
type ChatType = {
  name: string;
};
type PropType = {
  username: string;
};

const Chat = (props: PropType) => {
  const randnumb = () => String(Math.floor(Math.random() * 9));
  const username =
    props.username + "#" + randnumb() + randnumb() + randnumb() + randnumb(); //fix this
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const [currentChat, setCurrentChat] = useState("global");
  useEffect(() => {
    const init = async () => {
      await fetch("/api/socket");
    };
    init();
    socket = io();
    socket.on("connect", () => {
      socket.emit("new-user-joined", username);
    });

    socket.on("user-joined", (name: string) => {
      append(name, " joined the chat");
    });
    socket.on("recieve", (data: { name: string; message: string }) => {
      append(data.name, data.message);
      //This line is printing 2 times (if you build the app it won't)
      //solution : turn off strict mode
    });
    socket.on("user-disconnected", (name: string) => {
      append(name, " left the chat");
    });
    socket.on("clear", () => {
      setMessages([]);
    });
    return () => {};
  }, []);
  const append = (user: string, data: string) => {
    setMessages((prevMessages: MessageType[]) => [
      ...prevMessages,
      {
        sender: user,
        content: data,
      },
    ]);
  };
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() !== "") {
      // append(user, message)
      //messages me add karta hai

      // Send the message to the server
      socket.emit("send", { message, currentChat });

      // Clear the message input field
      setMessage("");
    }
  };
  const AddGroup = () => {
    const name = prompt("Room Id");
    if (name !== null && name.trim() !== "") {
      setChats((prevChat: ChatType[]) => [
        ...prevChat,
        {
          name: name,
        },
      ]);
      socket.emit("join-new-group", name);
      setCurrentChat(name);
    }
  };
  const joinChat = (chatName: string) => {
    socket.emit("join-old-chat", chatName);
    setMessages([]);
    setCurrentChat(chatName);
  };
  return (
    <>
      <div className={style.chat_app}>
        <div className={style.chat_header}>
          <h2>Global Chat Room</h2>
        </div>
        <div className={style.messaging_section}>
          <div className={style.Sidebar}>
            <button
              id={style.Global}
              className={style.Chat}
              onClick={() => {
                joinChat("global");
              }}
            >
              Global
            </button>

            {chats.map((chat: { name: string }, index: number) => (
              <button
                key={index}
                className={style.Chat}
                onClick={() => {
                  joinChat(chat.name);
                }}
              >
                {chat.name}
              </button>
            ))}

            <button
              id={style.Add_Group}
              className={style.Chat}
              onClick={() => {
                AddGroup();
              }}
            >
              Add Room
            </button>
          </div>

          <div className={style.chat_messages} style={{ color: "black" }}>
            {/* DO NOT REMOVE the inline style color:black . It took me 1 whole day to figure out why deployment is only working on brave(develeopement browser) and not anywhere else */}
            {/* Render the messages from the state */}
            {messages.map((message, index) => (
              <div key={index} className={style.message}>
                <span className={style.sender}>{message.sender}: </span>
                <span className={style.content}>{message.content}</span>
              </div>
            ))}
          </div>
        </div>

        <form className={style.chat_form} onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}

            // Update the input value using state and onChange event
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};
export default Chat;
