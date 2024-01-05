
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useClientRect from "@/hooks/heightMeasuringHook";
import { ChangeEvent, LegacyRef, useState } from "react";
import { room ,message} from "@backend/types/socket_types";
import { usernameState } from "@/store/atoms/username";
import { useRecoilValue } from "recoil";

// const messages: message[] = [
//   { message: "Hi there!", username: "bot" },
//   { message: "Hello!", username: "user" },
//   { message: "How can I assist you today?", username: "bot" },
// ];

const ChatUI = (props: {
  NavbarHeight: any;
  messages: message[];
  sendMsg:(message:string)=>void
}) => {
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (input.trim() !== "") {
      props.sendMsg(input)
    }
    setInput("");
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(event.target.value);
  };
  const [heightOfSendButtonArea, heightOfSendButtonArearef] = useClientRect();
  return (
    <Box
      id="the box"
      sx={{
        height: `calc(100% - ${props.NavbarHeight})`,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          p: 2,
          height: `calc(100vh - ${props.NavbarHeight}px - ${heightOfSendButtonArea}px)`,
        }}
      >
        {props.messages.map((message) => (
          <Message message={message} />
        ))}
      </Box>
      <Box
        ref={heightOfSendButtonArearef as any}
        sx={{ p: 2, backgroundColor: "background.default" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              placeholder="Type a message"
              value={input}
              onChange={(e) => handleInputChange(e)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const Message = (props:{message:message,}) => {
    const message=props.message.message;
  const notUserA = props.message.username!==useRecoilValue(usernameState)

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: notUserA ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          backgroundColor: notUserA ? "primary.light" : "secondary.light",
        }}
      >
        <Typography variant="body1">{message}</Typography>
      </Paper>
    </Box>
  );
};

export default ChatUI;
