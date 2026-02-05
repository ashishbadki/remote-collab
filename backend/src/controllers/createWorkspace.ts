import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Workspace from "../models/createWorkspaceModel";

export const createWorkspace = async (req: AuthRequest, res: Response) => {
  const { name, type } = req.body;

  const workspace = await Workspace.create({
    name,
    type,
    owner: req.userId,
  });

  res.status(201).json(workspace);
};
