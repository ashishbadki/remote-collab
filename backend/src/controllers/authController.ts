import User from "../models/userModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response)=>{
    try{
        const {name, email, password, confirmPassword} = req.body;
        const existingUser =await User.findOne({
            email,
        })

        if(existingUser){
            res.status(400).json({
                msg: "User already exists"
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address",
        });
        }


        if (password !== confirmPassword) {
            return res.status(400).json({
            success: false,
            message: "Passwords do not match",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = User.create({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        })

        res.status(200).json({
            user,
            msg: "User Signed up successfully",
            success: true,
        })
    }
    catch(error){
        console.log("Error while login")
        console.log(error);
    }
}

export const login = async (req: Request, res: Response)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email  
        });

        if(!user){  
            return res.status(400).json({
                msg: "User does not exist",
            });
        }
        if(password !== user.password){
            return res.status(400).json({
                msg: "Wrong password",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address",
        });
        }

        const jwtToken = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

       
        res.status(200).json({
            user,
            jwtToken,
            msg: "User logged in successfully",
            success: true,
        })
    }
    catch(error){
        console.log("Error while login")
        console.log(error);
    }
}