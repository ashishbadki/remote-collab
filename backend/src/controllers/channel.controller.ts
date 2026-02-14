import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Channel from "../models/channel.model";
import Workspace from "../models/createWorkspaceModel";
import mongoose from "mongoose";

// Create a new channel
export const createChannel = async (req: AuthRequest, res: Response) => {
    try{
        const workspaceId = String(req.params.workspaceId);

        const workspaceExist = await Workspace.findOne({ _id: workspaceId });

        if (!workspaceExist) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found",
            });
        }

        const isOwner = workspaceExist.owner.toString() === req.userId;
        const isMember = workspaceExist.members.some((member) => member.userId?.toString() === req.userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not a member of this workspace",
            });
        }


        const { name } = req.body;
        const channel = await Channel.create({
            name,
            workspace: workspaceId,
            createdBy: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Channel created successfully",
            channel,
        });
    }
    catch(error){
        console.error("Create channel error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create channel",
        });
    }
}


export const getChannelByWorkspace = async (req: AuthRequest, res: Response) => {
    try {
        const workspaceId = String(req.params.workspaceId);

        const userId = req.userId;

        if(!mongoose.Types.ObjectId.isValid(workspaceId)){
            return res.status(400).json({
                success: false,
                message: "Invalid workspace ID",
            });
        }

        const workspace = await Workspace.findById(workspaceId);

        if(!workspace){
            return res.status(404).json({
                success: false,
                message: "Workspace not found",
            });
        }

        const isOwner = workspace.owner.toString() === userId;

        const isMember = workspace.members.some((member) => member.userId?.toString() === userId);

        if(!isOwner && !isMember){
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not a member of this workspace",
            });
        }

        const channels = await Channel.find({ workspace: workspaceId });
        return res.status(200).json({
            success: true,
            message: "Channels fetched successfully",
            channels,
        });
    }
    catch(error){
        console.error("Get channels error:", error);
        return res.status(500).json({   
            success: false,
            message: "Failed to fetch channels",
        });
    }
}
