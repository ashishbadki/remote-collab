import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import channelRoutes from "./routes/channelRoutes";
import messageRoutes from "./routes/message.route";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

connectDB();

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/workspace", workspaceRoutes);

app.use("/api/v1/invite", inviteRoutes);

app.use("/api/v1/channel", channelRoutes);

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);

// Serve Swagger specification as JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use("/api/v1/messages", messageRoutes);
export default app;