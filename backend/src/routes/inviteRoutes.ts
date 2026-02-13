import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createInvite, joinWorkspaceInvite } from "../controllers/inviteController";

const router = Router();

//Fixed the path - more specific routes should come first
router.post("/accept/:token", authMiddleware, joinWorkspaceInvite);

//Fixed the path
router.post("/:workspaceId", authMiddleware, createInvite);



export default router;
