import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWorkspace, getAllWorkspace, deleteWorkspace } from "../controllers/workspaceController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Workspace
 *   description: Workspace management API
 */

/**
 * @swagger
 * /api/v1/workspace/create:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "My Awesome Workspace"
 *               description:
 *                 type: string
 *                 example: "A place for collaboration"
 *     responses:
 *       201:
 *         description: Workspace created successfully
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
 *                   example: "Workspace created successfully"
 *                 workspace:
 *                   $ref: '#/components/schemas/Workspace'
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
 */
router.post("/create", authMiddleware, createWorkspace);

/**
 * @swagger
 * /api/v1/workspace/my:
 *   get:
 *     summary: Get all workspaces for the authenticated user
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
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
 *                   example: "Workspaces fetched successfully"
 *                 workspaces:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/my", authMiddleware, getAllWorkspace);

/**
 * @swagger
 * /api/v1/workspace/{workspaceId}:
 *   delete:
 *     summary: Delete a workspace
 *     tags: [Workspace]
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
 *         description: Workspace deleted successfully
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
 *                   example: "Workspace deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (Not the owner)
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
router.delete("/:workspaceId", authMiddleware, deleteWorkspace)

export default router;
