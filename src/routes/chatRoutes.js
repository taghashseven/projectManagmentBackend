import express from 'express';
const router = express.Router();

import  {
  createMessage,
  getMessagesByProject,
  markMessageAsRead
}  from '../controllers/chatController.js'
import  { protect }  from '../middleware/authMiddleware.js'

router.route('/')
  .post(protect, createMessage);

router.route('/project/:projectId')
  .get(protect, getMessagesByProject);

router.route('/:id/read')
  .put(protect, markMessageAsRead);


export default router