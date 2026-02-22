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

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.use("/api/v1/messages", messageRoutes);
export default app;