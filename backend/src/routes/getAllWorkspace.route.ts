import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getAllWorkspace } from "../controllers/getAllWorkspace";
const router = Router();

router.get("/getAllWorkspaces", authMiddleware, getAllWorkspace)

export default router;