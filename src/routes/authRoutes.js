import  express  from 'express';

const router = express.Router();

import  {
  authUser,
  registerUser,
  getUserProfile ,
  getUsers
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

router.post('/login', authUser);                  //login 
router.post('/register', registerUser);           // done 
router.get('/profile', protect, getUserProfile);
router.get("/getusers" , getUsers)

export default router;