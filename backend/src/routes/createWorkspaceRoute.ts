import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWorkspace } from "../controllers/createWorkspace";
const router = Router();

router.post("/create", authMiddleware, createWorkspace);

export default router;