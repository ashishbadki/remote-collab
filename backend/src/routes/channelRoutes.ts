import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createChannel, getChannelByWorkspace, deleteChannel } from "../controllers/channel.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Channel
 *   description: Channel management API
 */

/**
 * @swagger
 * /api/v1/channel/create/{workspaceId}:
 *   post:
 *     summary: Create a new channel in a workspace
 *     tags: [Channel]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "general"
 *     responses:
 *       201:
 *         description: Channel created successfully
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
 *                   example: "Channel created successfully"
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Bad request
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
 *       403:
 *         description: Forbidden (Not a member or admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/create/:workspaceId", authMiddleware, createChannel);

/**
 * @swagger
 * /api/v1/channel/workspace/{workspaceId}:
 *   get:
 *     summary: Get all channels by workspace
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: List of channels
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
 *                   example: "Channels fetched successfully"
 *                 channels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Channel'
 *       401:
 *         description: Unauthorized
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
router.get("/workspace/:workspaceId", authMiddleware, getChannelByWorkspace);

/**
 * @swagger
 * /api/v1/channel/delete/{channelId}:
 *   delete:
 *     summary: Delete a channel
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The channel ID
 *     responses:
 *       200:
 *         description: Channel deleted successfully
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
 *                   example: "Channel deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (Not an admin/owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Channel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/delete/:channelId", authMiddleware, deleteChannel);

export default router;
