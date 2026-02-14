import { Router } from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import { createChannel, getChannelByWorkspace } from "../controllers/channel.controller";

const router = Router();

router.post("/create/:workspaceId", authMiddleware, createChannel);

router.get("/workspace/:workspaceId", authMiddleware, getChannelByWorkspace);

export default router;