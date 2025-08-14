// transactions.routes.js

import express from "express";
import {
  matchFoodListings,
  confirmDeliveryAndMintNFT,
  getUserTransactions,
  getOrderTimeline,
  updateOrderStatus,
  rejectParticipation
} from "../controllers/transactions.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();



// Match food listings
router.post("/match", matchFoodListings);


// Get user transactions
router.get('/user', authMiddleware, getUserTransactions); 
// Confirm delivery and mint NFT
router.post(
  "/confirm-delivery/:transactionId",
  authMiddleware,
  confirmDeliveryAndMintNFT
);


// Update transaction status
router.patch(
  '/orders/:transactionId/status',
  authMiddleware,
  updateOrderStatus
);

// Get transaction timeline
router.get(
  '/orders/:orderId/timeline',
  authMiddleware,
  getOrderTimeline
);

// Reject participation in a transaction
router.post(
  '/reject/:transactionId/:userId',
  authMiddleware,
  rejectParticipation
);

export default router;