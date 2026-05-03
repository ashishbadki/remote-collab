import http from "http";
import type { Application } from "express";
import { initChatSocket } from "./sockets/chat.socket";
import getSecrets from "./config/secrets";
import app from "./app";
import { connectDB } from "./config/db";

(async () => {
  await getSecrets(); // 🔥 sabse pehle secrets load

  await connectDB(); // ✅ DB connect after secrets

  const server = http.createServer(app as unknown as Application);

  initChatSocket(server);

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
})();