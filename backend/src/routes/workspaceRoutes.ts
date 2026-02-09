import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWorkspace } from "../controllers/createWorkspace";
import { getAllWorkspace } from "../controllers/getAllWorkspace";
import { deleteWorkspace } from "../controllers/deleteWorkspace";

const router = Router();
      

router.post("/create", authMiddleware, createWorkspace);

router.get("/my", authMiddleware, getAllWorkspace);

router.delete("/:workspaceId", authMiddleware, deleteWorkspace)

export default router;
