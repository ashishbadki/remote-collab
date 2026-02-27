import app from "./app";
import http from "http";
import { initChatSocket } from "./sockets/chat.socket";

const server = http.createServer(app);

initChatSocket(server);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
