import  express  from 'express';

const router = express.Router();

import  {
  authUser,
  registerUser,
  getUserProfile ,
  getUsers , 
  updateUser , 
  deleteUser
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

router.post('/login', authUser);                  //login 
router.post('/register', registerUser);           // done 
router.get('/profile', protect, getUserProfile);
router.get("/getusers" , getUsers)
router.post('/users/:id', protect, updateUser);       // done
router.delete('/users/:id', protect, deleteUser);     // done

export default router;