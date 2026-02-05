import { Router } from "express";
import { profile } from "../controllers/user.controller";  
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();    

router.get("/profile", authMiddleware, profile);

export default router;