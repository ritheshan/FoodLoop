// utils/activityMonitoring.js
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import AuditLog from '../models/AuditLog.js';

/**
 * Logs an activity for audit purposes.
 * @param {ObjectId} userId - The user's ID.
 * @param {string} action - What action was performed.
 * @param {Object} details - Additional metadata about the action.
 * @param {string} severity - Severity level ('info', 'warning', 'critical').
 */
export const logActivity = async (userId, action, details = {}, severity = 'info') => {
  try {
    const log = new AuditLog({
      user: userId,
      action,
      details,
      severity,
      timestamp: new Date()
    });
    await log.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Checks for unusual or suspicious user behavior.
 * @param {ObjectId} userId - The user's ID.
 * @param {string} action - The action being evaluated.
 * @param {Object} details - Context of the action.
 * @returns {Object|null} - { isSuspicious, reason } or null on failure.
 */
export const checkForSuspiciousActivity = async (userId, action, details = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    let isSuspicious = false;
    let reason = '';

    // 1. Rapid-fire actions in the last 5 minutes
    const recentLogs = await AuditLog.countDocuments({
      user: userId,
      timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (recentLogs > 30) {
      isSuspicious = true;
      reason = 'Too many actions in a short time period';
    }

    // 2. Unusual donation activity
    if (action.includes('donation')) {
      const recentDonations = await Donation.countDocuments({
        donorId: userId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      const isNewUser = user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      if (isNewUser && recentDonations > 10) {
        isSuspicious = true;
        reason = 'New user with unusually high donation volume';
      }
    }

    // 3. TODO: Detect suspicious location updates
    if (action === 'location_update' && details.newLocation) {
      // Add logic to compare timestamps and geolocation here
    }

    if (isSuspicious) {
      await logActivity(userId, 'suspicious_activity_detected', { reason, originalAction: action }, 'warning');
      await User.findByIdAndUpdate(userId, {
        $set: { flagged: true, flagReason: reason }
      });
    }

    return { isSuspicious, reason };

  } catch (error) {
    console.error('Error checking for suspicious activity:', error);
    return null;
  }
};
