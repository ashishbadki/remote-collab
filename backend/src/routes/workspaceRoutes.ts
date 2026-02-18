import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWorkspace, getAllWorkspace, deleteWorkspace, getWorkspaceById } from "../controllers/workspaceController";

const router = Router();


router.post("/create", authMiddleware, createWorkspace);

router.get("/my", authMiddleware, getAllWorkspace);

router.get("/:workspaceId", authMiddleware, getWorkspaceById);

router.delete("/:workspaceId", authMiddleware, deleteWorkspace)

export default router;
