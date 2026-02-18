import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Workspace from "../models/createWorkspaceModel";

// Create a new workspace
export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type } = req.body;

    const workspace = await Workspace.create({
      name,
      type,
      owner: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("Create workspace error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create workspace",
    });
  }
};

// Get all workspaces for the current user (owned or member)
export const getAllWorkspace = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    // Find workspaces where user is owner OR is a member
    const workspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { "members.userId": userId }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
    });
  }
};

// Delete a workspace
export const deleteWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Only owner can delete
    if (workspace.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only owner can delete this workspace",
      });
    }

    await Workspace.findByIdAndDelete(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("Delete workspace error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete workspace",
    });
  }
};

export const getWorkspaceById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is owner or member
    const isMember =
      workspace.owner.toString() === userId ||
      (workspace.members &&
        workspace.members.some(
          (member) => member.userId && member.userId.toString() === userId
        ));

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this workspace",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workspace fetched successfully",
      workspace,
    });
  } catch (error) {
    console.error("Get workspace by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspace",
    });
  }
};

