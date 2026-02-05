import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWorkspace } from "../controllers/createWorkspace";
import { getAllWorkspace } from "../controllers/getAllWorkspace";

const router = Router();


router.post("/create", authMiddleware, createWorkspace);

router.get("/my", authMiddleware, getAllWorkspace);

export default router;
