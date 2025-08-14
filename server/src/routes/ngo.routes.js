import express from 'express';
import { claimDonation } from '../controllers/ngo.controller.js'; 
import { authMiddleware } from '../middleware/authMiddleware.js'; 
import { updatePreferences } from '../controllers/ngo.controller.js';

const router = express.Router();

router.patch('/preferences', authMiddleware,updatePreferences);
router.post('/claim/:id', authMiddleware, claimDonation);

export default router;
