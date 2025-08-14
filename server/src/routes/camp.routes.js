// routes/reliefRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createReliefCamp,
  getAllReliefCamps,
  getReliefCampById,
  updateReliefCamp,
  deleteReliefCamp
} from '../controllers/reliefController.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @route   POST /api/relief-camps
 * @desc    Create a new relief camp (any authenticated user)
 * @access  Protected
 */
router.post('/', createReliefCamp);

/**
 * @route   GET /api/relief-camps
 * @desc    List all relief camps (pending, active, completed)
 * @access  Protected
 */
router.get('/', getAllReliefCamps);

/**
 * @route   GET /api/relief-camps/:id
 * @desc    Get details of a single relief camp
 * @access  Protected
 */
router.get('/:id', getReliefCampById);

/**
 * @route   PATCH /api/relief-camps/:id
 * @desc    Update a relief camp (e.g. change status, edit resourcesNeeded)
 * @access  Protected
 */
router.patch('/:id', updateReliefCamp);

/**
 * @route   DELETE /api/relief-camps/:id
 * @desc    Delete a relief camp
 * @access  Protected
 */
router.delete('/:id', deleteReliefCamp);

export default router;
