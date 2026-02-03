const express = require('express');
const { body, param } = require('express-validator');
const tasksController = require('../controllers/tasks');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: User-scoped task CRUD
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "8c9f90a5-3d4a-4b10-9c9a-0d0be9c6a777"
 *         title:
 *           type: string
 *           example: "Buy milk"
 *         completed:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks for current user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, tasksController.list.bind(tasksController));

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  requireAuth,
  [body('title').isString().trim().notEmpty().withMessage('title is required'), validate],
  tasksController.create.bind(tasksController)
);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated task
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.patch(
  '/:id',
  requireAuth,
  [
    param('id').isString().notEmpty().withMessage('id is required'),
    body('title').optional().isString().trim().notEmpty().withMessage('title cannot be empty'),
    body('completed').optional().isBoolean().withMessage('completed must be boolean'),
    validate,
  ],
  tasksController.update.bind(tasksController)
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.delete(
  '/:id',
  requireAuth,
  [param('id').isString().notEmpty().withMessage('id is required'), validate],
  tasksController.remove.bind(tasksController)
);

module.exports = router;
