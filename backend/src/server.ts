import http from "http";
import type { Application } from "express";

(async () => {
  // 🔥 Load environment variables first
  if (process.env.NODE_ENV === "production") {
    const getSecrets = require("./config/secrets").default;
    await (getSecrets as unknown as () => Promise<void>)();
  } else {
    require("dotenv").config();
    console.log("✅ Secrets loaded from .env (local dev mode)");
  }

  // 🚀 Import modules after environment is set
  const { connectDB } = require("./config/db");
  const app = require("./app").default;
  const { initChatSocket } = require("./sockets/chat.socket");

  await connectDB(); // ✅ DB connect after secrets

  const server = http.createServer(app as unknown as Application);
  initChatSocket(server);

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
})();
