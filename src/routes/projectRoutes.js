import express from 'express';
const router = express.Router();

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  putTask,
  deleteTask,
  addResource,
  deleteResource
} from '../controllers/projectController.js';

import { protect } from '../middleware/authMiddleware.js';

// Base project routes
router
  .route('/')
  .all(protect)
  .get(getProjects)
  .post(createProject);

// Single project routes
router
  .route('/:id')
  .all(protect)
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Team routes
router
  .route('/:id/team')
  .all(protect)
  .post(addTeamMember);

router
  .route('/:id/team/:userId')
  .all(protect)
  .delete(removeTeamMember);

// Task routes
router
  .route('/:projectId/tasks')
  .all(protect)
  .put(putTask);


router
  .route('/:projectId/tasks/:taskId')
  .all(protect)
  .delete(deleteTask);

  // Resource routes
router
.route('/:projectId/resources')
.all(protect)
.post(addResource);

router
.route('/:projectId/resources/:resourceId')
.all(protect)
.delete(deleteResource);

export default router;
