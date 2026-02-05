import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import profileRoute from "./routes/profileRoute";
import workspaceRoutes from "./routes/workspaceRoutes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

app.use("/api/v1/auth", authRoutes, profileRoute);

app.use("/api/v1/workspace", workspaceRoutes);

export default app;