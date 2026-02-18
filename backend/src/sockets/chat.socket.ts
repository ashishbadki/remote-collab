import { WebSocketServer, WebSocket } from "ws";
import Message from "../models/message.model";
import { encryptMessage } from "../utils/encyption";
import { verifySocketToken } from "../middlewares/wsAuth";

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  workspaceId?: string;
}

export const initChatSocket = (server: any) => {
  const wss = new WebSocketServer({ server });

  const workspaceRooms = new Map<string, Set<ExtendedWebSocket>>();

  wss.on("connection", (socket: ExtendedWebSocket, req) => {
    const token = req.url?.split("token=")[1];

    console.log("WebSocket Connection Attempt - Token:", token ? "Present" : "Missing");

    const decoded: any = verifySocketToken(token || "");

    console.log("Decoded Token:", decoded);

    if (!decoded) {
      console.log("WebSocket Authentication Failed: Invalid Token");
      socket.close();
      return;
    }

    socket.userId = decoded.userId;
    console.log("Socket UserId Set To:", socket.userId);

    socket.on("message", async (data) => {
      const parsed = JSON.parse(data.toString());

      const { workspaceId, channelId, message } = parsed;

      socket.workspaceId = workspaceId;

      const encrypted = encryptMessage(message);

      // Save to DB
      await Message.create({
        workspaceId,
        channelId,
        sender: socket.userId,
        encryptedText: encrypted,
      });

      // Broadcast
      if (!workspaceRooms.has(workspaceId)) {
        workspaceRooms.set(workspaceId, new Set());
      }

      workspaceRooms.get(workspaceId)?.add(socket);

      workspaceRooms.get(workspaceId)?.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              sender: socket.userId,
              channelId,
              message: message, // Send plaintext to connected clients
            })
          );
        }
      });
    });
  });
};