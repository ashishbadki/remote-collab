import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createInvite, joinWorkspaceInvite } from "../controllers/inviteController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invite
 *   description: Invitation management API
 */

//Fixed the path - more specific routes should come first
/**
 * @swagger
 * /api/v1/invite/accept/{token}:
 *   post:
 *     summary: Accept a workspace invitation
 *     tags: [Invite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The invitation token
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Joined workspace successfully"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/accept/:token", authMiddleware, joinWorkspaceInvite);

//Fixed the path
/**
 * @swagger
 * /api/v1/invite/{workspaceId}:
 *   post:
 *     summary: Create an invitation for a workspace
 *     tags: [Invite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newmember@example.com"
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 inviteLink:
 *                   type: string
 *                   example: "http://localhost:3000/api/v1/invite/accept/xy7z..."
 *       403:
 *         description: Forbidden (Not a member or admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:workspaceId", authMiddleware, createInvite);



export default router;
