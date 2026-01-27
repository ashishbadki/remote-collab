const JWT_SECRET = process.env.JWT_SECRET
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/userModel';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }
        (req as any).user = user; 
        next();
    }
    catch (error) {
        console.log("Error in auth middleware");
        console.log(error);
        res.status(401).json({ msg: "Invalid token" });
    }
}