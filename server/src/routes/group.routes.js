import express from 'express';
import {
  createGroupDonation,
  joinGroupDonation,
  optimizeGroupRoute,
  startGroupDonation,
  completeGroupDonation,
  getGroupDetails
} from '../controllers/groupDonationController.js';

const router = express.Router();

router.post('/', createGroupDonation);
router.post('/:id/join', joinGroupDonation);
router.post('/:id/optimize-route', optimizeGroupRoute);
router.post('/:id/start', startGroupDonation);
router.post('/:id/complete', completeGroupDonation);
router.get('/:id', getGroupDetails);

export default router;
