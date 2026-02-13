import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWorkspace, getAllWorkspace, deleteWorkspace } from "../controllers/workspaceController";

const router = Router();
      

router.post("/create", authMiddleware, createWorkspace);

router.get("/my", authMiddleware, getAllWorkspace);

router.delete("/:workspaceId", authMiddleware, deleteWorkspace)

export default router;
