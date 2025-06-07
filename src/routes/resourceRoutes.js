import express  from 'express';
import  {
  createResource,
  getResourcesByProject,
  deleteResource
} from '../controllers/resourceController.js';

import  { protect }  from '../middleware/authMiddleware.js' ;

const router = express.Router();


router.route('/')
  .post(protect, createResource);

router.route('/project/:projectId')
  .get(protect, getResourcesByProject);

router.route('/:id')
  .delete(protect, deleteResource);


export default router