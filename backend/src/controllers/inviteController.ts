import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Invite from "../models/invite.model";
import User from "../models/userModel";
import Workspace from "../models/createWorkspaceModel";

// Create an invite
export const createInvite = async (req: AuthRequest, res: Response) => {
    try {
        const { workspaceId } = req.params as { workspaceId: string };
        const userId = req.userId;

        console.log(`Creating invite for workspaceId: ${workspaceId} by user: ${userId}`);

        // Check if workspaceId is a valid ObjectId
        if (!workspaceId || !workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
            console.error(`Invalid workspace ID format: ${workspaceId}`);
            return res.status(400).json({
                success: false,
                message: "Invalid workspace ID format",
            });
        }

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            console.error(`Workspace not found: ${workspaceId}`);
            return res.status(404).json({
                success: false,
                message: "Workspace not found",
            });
        }
        if (workspace.owner.toString() !== userId) {
            console.error(`User ${userId} is not owner of workspace ${workspaceId}`);
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }
        const token = Math.random().toString(36).substr(2, 8);

        const invite = await Invite.create({
            token,
            workspaceId,
            createdBy: userId,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        return res.status(201).json({
            success: true,
            inviteLink: `http://localhost:3000/api/v1/invite/accept/${invite.token}`,
        });
    }
    catch (error) {
        console.error("Create invite error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create invite",
        });
    }
}


export const joinWorkspaceInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;
    const userId = req.userId;

    console.log(`[joinWorkspaceInvite] Token received: ${token}, UserId: ${userId}`);

    const invite = await Invite.findOne({ token });

    if (!invite) {
      console.error(`[joinWorkspaceInvite] Invite not found for token: ${token}`);
      return res.status(404).json({
        success: false,
        message: "Invite not found",
      });
    }

    console.log(`[joinWorkspaceInvite] Invite found:`, invite);

    if (invite.used) {
      return res.status(400).json({
        success: false,
        message: "Invite already used",
      });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invite expired",
      });
    }

    const workspace = await Workspace.findById(invite.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const alreadyMember = workspace.members.some(
      (member) => member.userId?.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "Already a member of this workspace",
      });
    }

    workspace.members.push({
      userId: userId,
      role: invite.role,
    });

    await workspace.save();

    invite.used = true;
    await invite.save();

    console.log(`[joinWorkspaceInvite] User ${userId} successfully joined workspace ${invite.workspaceId}`);

    return res.status(200).json({
      success: true,
      message: "Joined workspace successfully",
    });

  } catch (error) {
    console.error("Join workspace error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to join workspace",
    });
  }
};



// export const joinWorkspaceInvite = async (req: AuthRequest, res: Response) => {
//     try {
//         const { token } = req.params;
//         const userId = req.userId;

//         const invite = await Invite.findOne({ token });

//         if (!invite) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Invite not found",
//             });
//         }
//         if (invite.used) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invite already used",
//             });
//         }

//         if (invite.expiresAt < new Date()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invite expired",
//             });
//         }

//         const workspace = await Workspace.findById(invite.workspaceId);

//         if (!workspace) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Workspace not found",
//             });
//         }

//         const alreadyMember = workspace.members.some(member => member.userId?.toString() === userId);

//         if (alreadyMember) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Already a member of this workspace",
//             });
//         }

//         workspace.members.push({ user: userId, role: invite.role });
//         await workspace.save();

//         invite.used = true;
//         await invite.save();

//         return res.status(200).json({
//             success: true,
//             message: "Joined workspace successfully",
//         });

//     }
//     catch (error) {
//         console.error("Join workspace error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to join workspace",
//         });
//     }
// }

// export const joinWorkspace = async (req: AuthRequest, res: Response) => {   
//     try{
//         const {token} = req.params;
//         const invite = await Invite.findOne({token});

//         if(!invite){
//             return res.status(404).json({
//                 success: false,
//                 message: "Invite not found",
//             });
//         }

//         const workspace = await Workspace.findById(invite.workspaceId);

//         if(!workspace){
//             return res.status(404).json({
//                 success: false,
//                 message: "Workspace not found",
//             });
//         }

//         const userId = req.userId;

//         const alreadyMember = workspace.members.some(member => member.userId?.toString() === userId);

//         if(alreadyMember){
//             return res.status(400).json({
//                 success: false,
//                 message: "Already a member of this workspace",
//             });
//         }

//         workspace.members.push({userId: userId, role: invite.role});
//         await workspace.save();
//         invite.used = true;
//         await invite.save();

//         return res.status(200).json({
//             success: true,
//             message: "Joined workspace successfully",
//         });

//     }
//     catch(error){
//         console.error("Join workspace error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to join workspace",
//         });
//     }
// }
