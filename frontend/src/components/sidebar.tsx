import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Avatar, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Icon, Stack, TextField } from "@mui/material";

import ChatUI from "@/components/message";
import useClientRect from "@/hooks/heightMeasuringHook";

import io, { Socket } from "socket.io-client";

import {chat, data,friend_req,message,room} from "@backend/types/socket_types"
import { Cancel, CheckCircle } from "@mui/icons-material";
import { messagesState } from "@/store/atoms/messages";
import { useRecoilState } from "recoil";
import Chat from "./chat";
import { currentRoomState } from "@/store/atoms/current_room";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));


type PropType = {
  username: string,
  oldusername: string
};

let socket: Socket;

export default function MiniDrawer(props:PropType) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tab, settab] = useState<string>("Chats");
  const [addFrndDialogue, setaddFrndDialogue] = useState(false);
  const [frndUsername, setfrndUsername] = useState("");
  const [openFrndRequestDialog, setOpenFrndRequestDialog] = useState(false);
  const [frndReqs, setfrndReqs] = useState<friend_req[]>([]);
  const [Chats, setChats] = useState<room[]>([])
  const [data_chats_add, setdata_chats_add] = useState<room>({ room_id: "",messages: [],users: [],});
  const [messages, setMessages] = useRecoilState(messagesState)
  const [message_data_recieve, setMessage_data_recieve] = useState<{ message: string; roomid: string; username: string }>({ message: "", roomid: "", username: "",})
  const [currentRoom, setCurrentRoom] = useRecoilState(currentRoomState)
  // const [scroll, setScroll] =useState("paper");

  const currentroomRef=useRef("");
  const messageRef=useRef<message[]>([])


  const handleFrndRequestDialogOpen = (scrollType: string) => () => {
    setOpenFrndRequestDialog(true);
    // setScroll(scrollType);
  };

  const handleFrndRequestDialogClose = () => {
    setOpenFrndRequestDialog(false);
  };

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (openFrndRequestDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openFrndRequestDialog]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const defineSidebar = (clicked: string) => {
    settab(clicked);
    // console.log(tab);
  };
  const openFrnd = () => {
    setaddFrndDialogue(true);
  };
  const closeFrnd = () => {
    setaddFrndDialogue(false);
  };
  const addFrnd = () => {
    socket.emit("AddFriend", { userA: username, userB: frndUsername });
    // console.log("FrndReq sent");
    setfrndUsername("");
    setaddFrndDialogue(false);
    // frndEmail se socket request bhejo
  };

  const delFrndReq=(userA:string)=>{
    const ListWithoutUserA=frndReqs.filter((reqest)=>reqest.userA!=userA)
    setfrndReqs(ListWithoutUserA);
  }

  const messagesSetter=(roomid:string)=>{
    currentroomRef.current = roomid;
    setCurrentRoom(currentroomRef.current);
  }

  const msgSend=(message:string)=>{
    socket.emit("send_message", {
      message: message,
      roomid: currentroomRef.current,
      username: username,
    });
    // console.log("message sent: "+message)
    
  }

  const randnumb = () => String(Math.floor(Math.random() * 9));
  let username: string;
  if (props.oldusername === "") {
    username =
      props.username 
      // + "#" + randnumb() + randnumb() + randnumb() + randnumb(); //fix this
  } else {
    username = props.oldusername;
  }

  useEffect(() => {
    // socket = io("http://localhost:4000");
    socket = io("http://34.121.108.174:4000");
    socket.on("connect", () => {
      socket.emit("user-connected", username);
    });
    socket.on("initialdata",(data:data)=>{
      // console.log("initial data recieved");
      setChats(data.rooms)
      setfrndReqs(data.friendRequests);
    });
    socket.on("AddFriendFromServer", (data:friend_req) => {
      // console.log("frndReq Recieved");
      setfrndReqs(frndReqs=>[...frndReqs,{userA:data.userA ,userB:data.userB}])
    });
    socket.on("DMcreated",(data:room)=>{
      // console.log("room created")
      setdata_chats_add(data)
    });
    socket.on(
      "recieveMessage",
      (data: { message: string; roomid: string; username: string }) => {
        // console.log("message recieved:1")
        setMessage_data_recieve(data);
        
        /***************** FIX THIS ↑ ****************/
        
      });
      
  },[]);

  useEffect(() => {
    if(currentRoom===""){
      return;
    }
    for (let chat of Chats) {
      if (chat.room_id === currentRoom) {
        messageRef.current = chat.messages;
        setMessages(messageRef.current);
        break;
      }
    }
    // console.log("Chats: "+Chats)
    // console.log("Room: "+currentRoom);
  }, [currentRoom])
  
  useEffect(()=>{
    // console.log("messages: "+messages);
  },[messages])
  
  useEffect(() => {
    
    const data=message_data_recieve as { message: string; roomid: string; username: string }
    if(data.message===""){
      return;
    }
    console.log("message recieved");
    if (currentRoom === data.roomid) {
      messageRef.current = [
        ...messages,
        { message: data.message, username: data.username },
      ];
      setMessages(messageRef.current);
    }
    // const chatRefCopy=chatRef.current;
    const chats_copy:room[]=JSON.parse(JSON.stringify(Chats));
    for (let chat of chats_copy) {
      if (chat.room_id === data.roomid) {
        chat.messages.push({message:data.message,username:data.username})
        // console.log(chats_copy)
        setChats(JSON.parse(JSON.stringify(chats_copy)))
        break;
      }
    }
  }, [message_data_recieve])

  useEffect(() => {
    if (JSON.stringify(data_chats_add)===JSON.stringify({
      room_id: "",
      messages: [],
      users: []
      })){
        return;
    }
    setChats((prev)=>[...prev,data_chats_add])
  }, [data_chats_add])
  

  
  const [heightOfNavbar, heightOfNavbarref] = useClientRect();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {Chats.map((chat_header) => (
            <Typography variant="h6" noWrap component="div">
              {/* {chat_header.room_id===currentRoom&&chat_header.users[0].user !== username? chat_header.users[0].user
                    : chat_header.users[1].user} */}
              Welcome to the chat
            </Typography>
          ))}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              display: "flex",
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={3}
            >
              <Box>
                <IconButton onClick={openFrnd}>
                  <PersonAddIcon />
                </IconButton>
                <Dialog open={addFrndDialogue} onClose={closeFrnd}>
                  <DialogTitle sx={{ textAlign: "center" }}>
                    Add Friend
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To add friend to this website, please enter your friend's
                      username here.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Friend username"
                      type="text"
                      fullWidth
                      variant="standard"
                      onChange={(e) => setfrndUsername(e.target.value)}
                      value={frndUsername}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeFrnd}>Cancel</Button>
                    <Button onClick={addFrnd}>Add</Button>
                  </DialogActions>
                </Dialog>
              </Box>
              <Box>
                <IconButton onClick={handleFrndRequestDialogOpen("paper")}>
                  <Badge
                    badgeContent={frndReqs.length}
                    color="primary"
                    max={69}
                  >
                    <NotificationsIcon color="action" />
                  </Badge>
                </IconButton>
                <Dialog
                  open={openFrndRequestDialog}
                  onClose={handleFrndRequestDialogClose}
                  scroll={"paper"}
                  aria-labelledby="scroll-dialog-title"
                  aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title">
                    Friend Requests
                  </DialogTitle>
                  {/* <DialogContent dividers={true}>
                    <DialogContentText
                      id="scroll-dialog-description"
                      ref={descriptionElementRef}
                      tabIndex={-1}
                    >
                      Friend Requests
                    </DialogContentText>
                    </DialogContent> */}
                  <DialogContent sx={{ overflow: "auto" }}>
                    {frndReqs.map((frndReq: friend_req) => (
                      <DialogContent dividers={true}>
                        <FriendRequest
                          userA={frndReq.userA}
                          userB={frndReq.userB}
                          deleteUser={delFrndReq}
                        />
                      </DialogContent>
                    ))}
                  </DialogContent>
                  <DialogActions sx={{ position: "sticky" }}>
                    <Button onClick={handleFrndRequestDialogClose}>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Stack>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary={"Chats"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider />
          {Chats &&
            Chats?.map((chat) => (
              <ListItem
                key={
                  chat.users[0].user !== username
                    ? chat.users[0].user
                    : chat.users[1].user
                }
                disablePadding
                sx={{ display: "block" }}
                onClick={(e) => {
                  e.preventDefault();
                  messagesSetter(chat?.room_id);
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar>F</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      chat.users[0].user !== username
                        ? chat.users[0].user
                        : chat.users[1].user
                    }
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader ref={heightOfNavbarref as LegacyRef<HTMLDivElement>} />
        <ChatUI
          NavbarHeight={heightOfNavbar}
          messages={messageRef.current}
          sendMsg={msgSend}
        />
      </Box>
    </Box>
  );
}

interface frndReqWithDelUser extends friend_req {
  deleteUser: (userA: string) => void;
}

export const FriendRequest = (props: frndReqWithDelUser) => {
  const AcceptFrndReq=()=>{
    socket.emit("AcceptFriendRequest",{userA:props.userA,userB:props.userB});
    // console.log("frndReq Accepted")
    props.deleteUser(props.userA);
  }
  const RejectFrndReq = () => {
    socket.emit("RejectFriendRequest", {
      userA: props.userA,
      userB: props.userB,
    });
    props.deleteUser(props.userA)
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar>{props.userA[0]}</Avatar>
        <Typography sx={{ textOverflow: "ellipsis", margin: "0 5px 0 5px", width:"200px"}}>
          {props.userA}
        </Typography>
        <IconButton onClick={()=>AcceptFrndReq()}>
          <CheckCircle></CheckCircle>
        </IconButton>
        <IconButton onClick={()=>RejectFrndReq()}>
          <Cancel></Cancel>
        </IconButton>
      </Box>
    </>
  );
}
