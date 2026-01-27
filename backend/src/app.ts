import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes"

const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);

export default app;
