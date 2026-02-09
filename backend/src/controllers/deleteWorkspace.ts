import { Request, Response } from "express";
import Workspace from "../models/createWorkspaceModel";

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // from auth middleware
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

    // 🔐 Only admin can delete
    if (workspace.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete this workspace",
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
