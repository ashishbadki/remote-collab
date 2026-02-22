import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Message from "../models/message.model";
import { decryptMessage } from "../utils/encyption";

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { channelId } = req.params;

        const messages = await Message.find({ channelId }).populate("sender", "name");

        const decryptedMessages = messages.map((msg) => {
            try {
                return {
                    _id: msg._id,
                    sender: msg.sender,
                    message: decryptMessage(msg.encryptedText),
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt
                };
            } catch (err) {
                console.error(`Failed to decrypt message ${msg._id}`);
                return {
                    _id: msg._id,
                    sender: msg.sender,
                    message: "Error: Could not decrypt message",
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt
                };
            }
        });

        return res.status(200).json({
            success: true,
            messages: decryptedMessages
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export const deleteMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // Check if user is the sender
        if (message.sender.toString() === userId) {
            await Message.findByIdAndDelete(messageId);
            return res.status(200).json({
                success: true,
                message: "Message deleted successfully"
            });
        }

        // Check if user is admin/owner of the workspace
        // We need to import Workspace model to check permissions
        const Workspace = require("../models/createWorkspaceModel").default;
        const workspace = await Workspace.findById(message.workspaceId);

        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found"
            });
        }

        const isOwner = workspace.owner.toString() === userId;
        const isAdmin = workspace.members.some((member: any) => member.userId.toString() === userId && member.role === "admin");

        if (isOwner || isAdmin) {
            await Message.findByIdAndDelete(messageId);
            return res.status(200).json({
                success: true,
                message: "Message deleted successfully"
            });
        }

        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this message"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
