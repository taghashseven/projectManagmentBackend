import  express from 'express';
const router = express.Router();
import  {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember
} from '../controllers/projectController.js' ;

import  { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/team')
  .post(protect, addTeamMember);

router.route('/:id/team/:userId')
  .delete(protect, removeTeamMember);


export default router;