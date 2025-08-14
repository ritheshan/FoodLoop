import express from 'express';
import {
  getUsers,
  verifyUser,
  flagUser,
  deleteUser,
  getDonations,
  updateDonationStatus,
  getOverviewStats,
  getDonationStats,
  getUserStats,

  getAuditLogs,
  getDashboardStats,
  getDashboardAlerts,
  getRecentDonations,
  getUpcomingDistributions

} from '../controllers/admin.controller.js';
import { isAdmin, authMiddleware } from '../middleware/authMiddleware.js';
import cache from '../middleware/cache.middleware.js';
import redis from '../utils/redis.js';

const router = express.Router();

router.use(authMiddleware); 
//  router.use(isAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/dashboard-alerts', getDashboardAlerts);
// routes/donations.routes.js or admin.routes.js
router.get('/recent-donations', getRecentDonations);
// routes/admin.routes.js
router.get('/upcoming-distributions', getUpcomingDistributions);
router.get('/users', cache('users'), getUsers);

// Invalidate the /users cache whenever you verify/flag/delete a user
router.put('/users/:id/verify', async (req, res, next) => {
  // delete the cached GET /users
  await redis.del('users:/users');
  next();
}, verifyUser);

router.put('/users/:id/flag', async (req, res, next) => {
  await redis.del('users:/users');
  next();
}, flagUser);

router.delete('/users/:id', async (req, res, next) => {
  await redis.del('users:/users');
  next();
}, deleteUser);

// -- DONATIONS --
router.get('/donations', cache('donations'), getDonations);

router.put('/donations/:id/status', async (req, res, next) => {
  await Promise.all([
    // clear the list page
    redis.del('donations:/donations'),
    // clear any analytics that depend on donations
    redis.del('analytics-donations:/analytics/donations'),
    redis.del('analytics-overview:/analytics/overview'),
  ]);
  next();
}, updateDonationStatus);

// -- ANALYTICS --
// Overview dashboard
router.get('/analytics/overview', cache('analytics-overview'), getOverviewStats);
// Donation stats
router.get('/analytics/donations', cache('analytics-donations'), getDonationStats);
// User stats
router.get('/analytics/users', cache('analytics-users'), getUserStats);

// -- AUDIT LOGS --
router.get('/audit-logs', cache('audit-logs'), getAuditLogs);
export default router;
