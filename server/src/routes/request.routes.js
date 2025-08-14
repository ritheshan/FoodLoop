import express from 'express';
import {
  createFoodRequest,
  getUserRequests,
  getRequestById,
getAllRequests,
  claimRequest
} from '../controllers/foodReq.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All endpoints require logged‑in user
router.use(authMiddleware);

// Create a new request
router.post('/', createFoodRequest);

// List & detail
router.get('/', getUserRequests);
router.get('/:id', getRequestById);
router.get('/all', getAllRequests);
router.post('/:id/claim', claimRequest);

export default router;
