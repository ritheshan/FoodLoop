import express from 'express';
import { getImpactStats , getDonationTrends, getDonationGrowth, getUserTrust } from '../controllers/impact.controller.js';

const router = express.Router();


router.get('/stats', getImpactStats);
router.get('/donation-trends', getDonationTrends);
// In impact.routes.js
router.get('/donation-growth', getDonationGrowth);
router.get('/user-trust', getUserTrust);

export default router;
