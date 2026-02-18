import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMessages, deleteMessage } from "../controllers/messageController";

const router = Router();

router.get("/:channelId", authMiddleware, getMessages);
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;
