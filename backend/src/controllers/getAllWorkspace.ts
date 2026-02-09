import { Response } from "express";
import Workspace from "../models/createWorkspaceModel";
import { AuthRequest } from "../types/authRequest";

export const getAllWorkspace = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    const workspaces = await Workspace.find({
      owner: userId,
    });
    return res.status(200).json({
      success: true,
      workspaces,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
    });
  }
};
