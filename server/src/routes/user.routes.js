import express from 'express';
import { getUserProfile, changePassword } from '../controllers/user.controller.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/profile', authMiddleware, getUserProfile); 
router.post('/change-password', authMiddleware, changePassword);

export default router;
