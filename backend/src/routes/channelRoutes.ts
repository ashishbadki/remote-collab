import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createChannel, getChannelByWorkspace, deleteChannel } from "../controllers/channel.controller";

const router = Router();

router.post("/create/:workspaceId", authMiddleware, createChannel);

router.get("/workspace/:workspaceId", authMiddleware, getChannelByWorkspace);

router.delete("/delete/:channelId", authMiddleware, deleteChannel);

export default router;
