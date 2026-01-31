import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes"
import cors from "cors";

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);

export default app;
