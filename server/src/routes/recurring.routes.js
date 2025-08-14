import express from 'express';
import { createRecurring, getMyRecurring,updateRecurring } from '../controllers/recurring.controller.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();
// routes/recurringRoutes.js

router.put('update/:id', authMiddleware, updateRecurring);

router.post('/create', authMiddleware, createRecurring);
router.get('/existing', authMiddleware, getMyRecurring);
export default router;