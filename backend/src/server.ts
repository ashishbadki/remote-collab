import http from "http";
import type { Application } from "express";

(async () => {
  // 🔥 Load environment variables first
  if (process.env.NODE_ENV === "production") {
    const { default: getSecrets } = await import("./config/secrets.js");
    await (getSecrets as unknown as () => Promise<void>)();
  } else {
    const dotenv = await import("dotenv");
    dotenv.default.config();
    console.log("✅ Secrets loaded from .env (local dev mode)");
  }

  // 🚀 Import modules after environment is set
  const { connectDB } = await import("./config/db.js");
  const { default: app } = await import("./app.js");
  const { initChatSocket } = await import("./sockets/chat.socket.js");

  await connectDB(); // ✅ DB connect after secrets

  const server = http.createServer(app as unknown as Application);
  initChatSocket(server);

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
})();