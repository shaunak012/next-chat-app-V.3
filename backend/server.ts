require("dotenv").config();
import chatRoutes from "./routes/chat";
import apps  from "./routes/socket";

const app=apps.app;
const server =apps.server;

app.use("/rooms", chatRoutes);

server.listen(process.env.PORT as string | 4000, () => {
    console.log("SERVER RUNNING");
});
