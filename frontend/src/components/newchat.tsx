import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
import style from "@/styles/newchat.module.css";
import MiniDrawer from "@/components/sidebar";


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
  oldusername:string;
};


const NewChat = (props: PropType) => {
  const randnumb = () => String(Math.floor(Math.random() * 9));
  let username:string;
  if(props.oldusername===""){
    username=props.username + "#" + randnumb() + randnumb() + randnumb() + randnumb(); //fix this
  }else{
    username=props.oldusername;
  }
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const [currentChat, setCurrentChat] = useState("global");
  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.on("connect", () => {
      socket.emit("user-connected", username);
    });
    socket.on("initialdata",(data)=>{
      
    });

  //   socket.on("user-joined", (name: string) => {
  //     append(name, " joined the chat");
  //   });
  //   socket.on("recieve", (data: { name: string; message: string }) => {
  //     append(data.name, data.message);
  //     //This line is printing 2 times (if you build the app it won't)
  //     //solution : turn off strict mode
  //   });
  //   socket.on("user-disconnected", (name: string) => {
  //     append(name, " left the chat");
  //   });
  //   socket.on("clear", () => {
  //     setMessages([]);
  //   });
  //   return () => {};
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
      //   socket.emit("send", { message, currentChat });

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
      //   socket.emit("join-new-group", name);
      setCurrentChat(name);
    }
  };

  const joinChat = (chatName: string) => {
    // socket.emit("join-old-chat", chatName);
    setMessages([]);
    setCurrentChat(chatName);
  };

  // <MiniDrawer></MiniDrawer>
  return (
    <>
    
    </>
  );
};
export default NewChat;
/*  icon credit
<a href="https://www.flaticon.com/free-icons/comment" title="comment icons">Comment icons created by Smashicons - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/plus" title="plus icons">Plus icons created by Freepik - Flaticon</a>
*/