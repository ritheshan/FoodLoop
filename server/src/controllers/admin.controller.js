// controllers/adminController.js
import User from '../models/user.model.js';
import FoodListing from '../models/listing.model.js';
import Transaction from '../models/transaction.model.js';
import AuditLog from '../models/auditLog.model.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asynchandler.js';
import FoodReq from '../models/foodReq.model.js'; 
import { formatDistanceToNow } from 'date-fns';


/**
 * Get users with filtering capabilities
 */
export const getUsers = async (req, res) => {
  try {
    const { role, verificationStatus, searchTerm, limit = 10, page = 1 } = req.query;
    
    // Build query object
    const query = {};
    
    // Apply role filter
    if (role && role !== 'all') {
      query.role = role;
    }
    
    // Apply verification status filter
    if (verificationStatus) {
      if (verificationStatus === 'verified') {
        query.isVerified = true;
      } else if (verificationStatus === 'pending') {
        query.isVerified = false;
        query.flagged = false;
      } else if (verificationStatus === 'flagged') {
        query.flagged = true;
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { organizationName: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Return users with pagination metadata
    res.status(200).json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

/**
 * Verify a user account
 */
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Find and update the user
    const user = await User.findByIdAndUpdate(
      id,
      { 
        isVerified: true, 
        flagged: false, // Remove flag if present
        flagReason: null,
        verificationNotes: notes || '',
        verifiedBy: req.user._id, // Assuming req.user contains the authenticated admin
        verifiedAt: new Date()
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'user-update',
      details: {
        targetUser: id,
        field: 'verification',
        newValue: 'verified'
      },
      severity: 'info',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({ message: 'User verified successfully', user });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Error verifying user', error: error.message });
  }
};

/**
 * Flag a user account
 */
export const flagUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Flag reason is required' });
    }
    
    // Find and update the user
    const user = await User.findByIdAndUpdate(
      id,
      { 
        flagged: true, 
        flagReason: reason,
        isVerified: false // Remove verification if present
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'flag',
      details: {
        targetUser: id,
        reason
      },
      severity: 'warning',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({ message: 'User flagged successfully', user });
  } catch (error) {
    console.error('Error flagging user:', error);
    res.status(500).json({ message: 'Error flagging user', error: error.message });
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      // Get user info for audit log before deletion
      const user = await User.findById(id);
      
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Delete user
      await User.findByIdAndDelete(id).session(session);
      
      // Create audit log
      await AuditLog.create([{
        user: req.user._id,
        action: 'delete',
        details: {
          resource: 'user',
          resourceId: id,
          userEmail: user.email,
          userName: user.name
        },
        severity: 'critical',
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

/**
 * Get donations with filtering capabilities
 */
export const getDonations = async (req, res) => {
  try {
    const { status, donorType, flagged, dateRange, searchTerm, limit = 10, page = 1 } = req.query;
    
    // Build the base query for food listings
    const foodListingQuery = {};
    
    // Apply status filter to food listings
    if (status && status !== 'all') {
      foodListingQuery.status = status;
    }
    
    // Apply flagged filter (assuming we add a flagged field to the FoodListing schema)
    if (flagged === 'true') {
      foodListingQuery.flagged = true;
    }
    
    // Apply date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (dateRange) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }
      
      foodListingQuery.createdAt = { $gte: cutoffDate };
    }
    
    // First, retrieve food listings
    const skip = (page - 1) * limit;
    
    // Apply search term to donor name/email via aggregation
    let foodListings;
    let total;
    
    if (searchTerm) {
      // Need to use aggregation to search through donor fields
      const aggregationPipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'donor',
            foreignField: '_id',
            as: 'donorInfo'
          }
        },
        { $unwind: '$donorInfo' },
        {
          $match: {
            ...foodListingQuery,
            $or: [
              { 'foodDescription': { $regex: searchTerm, $options: 'i' } },
              { 'donorInfo.name': { $regex: searchTerm, $options: 'i' } },
              { 'donorInfo.email': { $regex: searchTerm, $options: 'i' } }
            ]
          }
        }
      ];
      
      // Add donor type filter if present
      if (donorType && donorType !== 'all') {
        // Convert frontend donorType to the role field in User schema
        let userRole;
        switch (donorType) {
          case 'individual':
            userRole = 'donor';
            break;
          case 'business':
            userRole = 'donor'; // Assuming business is a type of donor
            break;
          default:
            userRole = donorType;
        }
        
        aggregationPipeline[2].$match['donorInfo.role'] = userRole;
      }
      
      // Add count facet for pagination
      const facetedPipeline = [
        ...aggregationPipeline,
        {
          $facet: {
            items: [{ $skip: skip }, { $limit: parseInt(limit) }],
            totalCount: [{ $count: 'count' }]
          }
        }
      ];
      
      const result = await FoodListing.aggregate(facetedPipeline);
      
      foodListings = result[0].items;
      total = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    } else {
      // No search term, use regular find with populate
      foodListings = await FoodListing.find(foodListingQuery)
        .populate('donor', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Apply donor type filter if needed
      if (donorType && donorType !== 'all') {
        // Map frontend donorType to schema role
        let userRole = donorType === 'business' ? 'donor' : donorType;
        
        foodListings = foodListings.filter(listing => 
          listing.donor && listing.donor.role === userRole
        );
      }
      
      // Get total count
      total = await FoodListing.countDocuments(foodListingQuery);
    }
    
    // For each food listing, get the donation transaction if it exists
    const donations = await Promise.all(foodListings.map(async (listing) => {
      // Get related donation transaction
      const transaction = await Transaction.findOne({ foodListing: listing._id })
        .populate('ngo', 'name email')
        .populate('volunteer', 'name email');
      
      // Format the donation similar to your mockData structure
      return {
        id: listing._id,
        donorId: listing.donor._id,
        donorName: listing.donor.name,
        donorType: listing.donor.role === 'donor' ? 'individual' : listing.donor.role,
        items: [
          { 
            name: listing.foodDescription,
            quantity: listing.listingCount,
            weight: listing.weight,
            expiryDate: listing.expirationDate
          }
        ],
        status: listing.status,
        createdAt: listing.createdAt,
        scheduledPickup: listing.scheduledFor,
        completedAt: transaction?.updatedAt,
        value: Math.round(Math.random() * 100 + 50), // Placeholder for monetary value
        notes: transaction?.timeline[transaction.timeline.length - 1]?.notes || '',
        flagReason: listing.flagged ? listing.flagReason : undefined
      };
    }));
    
    res.status(200).json({
      donations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

/**
 * Update donation status
 */
export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Find the food listing
    const foodListing = await FoodListing.findById(id);
    
    if (!foodListing) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    // Update the food listing status
    foodListing.status = status;
    if (status === 'flagged' && !foodListing.flagged) {
      foodListing.flagged = true;
      foodListing.flagReason = notes || 'Flagged by admin';
    } else if (status !== 'flagged' && foodListing.flagged) {
      foodListing.flagged = false;
      foodListing.flagReason = null;
    }
    
    await foodListing.save();
    
    // Find the related donation transaction if exists
    let transaction = await Transaction.findOne({ foodListing: id });
    
    // If transaction exists, update its timeline
    if (transaction) {
      transaction.timeline.push({
        status,
        timestamp: new Date(),
        by: req.user._id,
        notes: notes || ''
      });
      
      await transaction.save();
    }
    
    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'update',
      details: {
        resource: 'donation',
        resourceId: id,
        field: 'status',
        newValue: status,
        notes: notes || ''
      },
      severity: status === 'flagged' ? 'warning' : 'info',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({ 
      message: 'Donation status updated successfully', 
      donation: {
        ...foodListing.toObject(),
        transaction: transaction ? transaction.toObject() : null
      }
    });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ message: 'Error updating donation status', error: error.message });
  }
};

/**
 * Get overview statistics
 */
export const getOverviewStats = async (req, res) => {
  try {
    const { timeframe = 'today' } = req.query;
    let cutoffDate;
    
    // Calculate timeframe dates
    const now = new Date();
    
    switch (timeframe) {
      case 'today':
        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setHours(0, 0, 0, 0)); // Default to today
    }
    
    // Calculate statistics
    const [
      totalUsers,
      newUsers,
      activeUsers,
      totalDonations,
      newDonations,
      completedDeliveries,
      pendingVerifications,
      flaggedItems
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: cutoffDate } }),
      User.countDocuments({ lastLogin: { $gte: cutoffDate } }), // Assuming you track lastLogin
      FoodListing.countDocuments({}),
      FoodListing.countDocuments({ createdAt: { $gte: cutoffDate } }),
      Transaction.countDocuments({ 
        'timeline.status': 'completed', 
        'timeline.timestamp': { $gte: cutoffDate } 
      }),
      User.countDocuments({ isVerified: false, flagged: false }),
      FoodListing.countDocuments({ flagged: true })
    ]);
    
    // Calculate total food rescued (in kg) from all completed donations
    const foodRescued = await FoodListing.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: cutoffDate } 
        } 
      },
      {
        $group: {
          _id: null,
          totalWeight: {
            $sum: {
              $toDouble: {
                $replaceAll: {
                  input: "$weight",
                  find: "kg",
                  replacement: ""
                }
              }
            }
          }
        }
      }
    ]);
    
    const totalFoodRescued = foodRescued.length > 0 ? foodRescued[0].totalWeight : 0;
    
    // Calculate growth percentages (simplified - you might want to compare with previous periods)
    const userGrowth = Math.round((newUsers / totalUsers) * 100) || 0;
    const donationGrowth = Math.round((newDonations / totalDonations) * 100) || 0;
    const foodRescuedGrowth = Math.round(Math.random() * 20); // Placeholder
    
    // Calculate people served (estimated based on weight)
    const peopleServed = Math.round(totalFoodRescued * 2.5); // Assuming 1kg feeds 2.5 people
    
    res.status(200).json({
      totalUsers,
      userGrowth,
      activeUsers,
      newUsers,
      totalDonations,
      donationGrowth,
      newDonations,
      completedDeliveries,
      totalFoodRescued,
      foodRescuedGrowth,
      peopleServed,
      pendingVerifications,
      flaggedItems
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ message: 'Error fetching overview stats', error: error.message });
  }
};

/**
 * Get donation statistics
 */
export const getDonationStats = async (req, res) => {
  try {
    const { timeframe = 'today' } = req.query;
    let cutoffDate;
    
    // Calculate timeframe dates
    const now = new Date();
    
    switch (timeframe) {
      case 'today':
        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        cutoffDate = new Date(now.setHours(0, 0, 0, 0)); // Default to today
    }
    
    // Get total donations and value for the period
    const totalDonations = await FoodListing.countDocuments({ 
      createdAt: { $gte: cutoffDate } 
    });
    
    // Get donations by donor type
    const byTypePipeline = [
      { $match: { createdAt: { $gte: cutoffDate } } },
      {
        $lookup: {
          from: 'users',
          localField: 'donor',
          foreignField: '_id',
          as: 'donorInfo'
        }
      },
      { $unwind: '$donorInfo' },
      {
        $group: {
          _id: '$donorInfo.role',
          count: { $sum: 1 }
        }
      }
    ];
    
    const donorTypeResults = await FoodListing.aggregate(byTypePipeline);
    
    // Format donor type results
    const byType = {
      individual: 0,
      business: 0,
      organization: 0
    };
    
    donorTypeResults.forEach(result => {
      if (result._id === 'donor') {
        byType.individual = result.count;
      } else if (result._id === 'business') {
        byType.business = result.count;
      } else if (result._id === 'NGO') {
        byType.organization = result.count;
      }
    });
    
    // Get top food categories (based on food description)
    // For this, we need to categorize based on keywords or use ML predictions
    const foodCategories = await FoodListing.aggregate([
      { $match: { createdAt: { $gte: cutoffDate } } },
      {
        $group: {
          _id: '$predictedCategory',
          count: { $sum: 1 },
          value: { $sum: { $multiply: [1, 100] } } // Placeholder monetary value
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const topCategories = foodCategories.map(category => ({
      name: category._id.charAt(0).toUpperCase() + category._id.slice(1),
      count: category.count,
      value: category.value
    }));
    
    // Get activity data (hourly/daily/weekly based on timeframe)
    let activityData;
    let trendsData;
    
    if (timeframe === 'today') {
      // Hourly data for today
      activityData = await getHourlyActivity(cutoffDate);
      trendsData = activityData.map(item => ({
        date: item.hour,
        donations: item.count,
        value: item.count * 250 // Placeholder value
      }));
    } else if (timeframe === 'week') {
      // Daily data for week
      activityData = await getDailyActivity(cutoffDate);
      trendsData = activityData.map(item => ({
        date: item.day,
        donations: item.count,
        value: item.count * 250 // Placeholder value
      }));
    } else {
      // Weekly data for month
      activityData = await getWeeklyActivity(cutoffDate);
      trendsData = activityData.map(item => ({
        date: item.week,
        donations: item.count,
        value: item.count * 250 // Placeholder value
      }));
    }
    
    // Get top contributors
    const topContributors = await getTopContributors(cutoffDate, 5);
    
    // Calculate total value (placeholder)
    const totalValue = topCategories.reduce((sum, category) => sum + category.value, 0);
    
    res.status(200).json({
      totalDonations,
      totalValue,
      byType,
      topCategories,
      ...(timeframe === 'today' ? { hourlyActivity: activityData } :
         timeframe === 'week' ? { dailyActivity: activityData } :
         { weeklyActivity: activityData }),
      trends: trendsData,
      topContributors
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ message: 'Error fetching donation stats', error: error.message });
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (req, res) => {
  try {
    const { timeframe = 'today' } = req.query;
    let cutoffDate;
    
    // Calculate timeframe dates
    const now = new Date();
    
    switch (timeframe) {
      case 'today':
        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        cutoffDate = new Date(now.setHours(0, 0, 0, 0)); // Default to today
    }
    
    // Get new users count
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: cutoffDate } 
    });
    
    // Get active users count (users who logged in during the period)
    // Assuming you track user logins in a field called lastLogin
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: cutoffDate } 
    });
    
    // Get users by role
    const roleResults = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format role results
    const byRole = {
      donor: 0,
      volunteer: 0,
      distributor: 0,
      business: 0
    };
    
    roleResults.forEach(result => {
      if (result._id === 'donor') {
        byRole.donor = result.count;
      } else if (result._id === 'volunteer') {
        byRole.volunteer = result.count;
      } else if (result._id === 'NGO') {
        byRole.distributor = result.count;
      } else if (result._id === 'business') {
        byRole.business = result.count;
      }
    });
    
    // Get verification status
    const verifiedCount = await User.countDocuments({ isVerified: true });
    const pendingCount = await User.countDocuments({ isVerified: false, flagged: false });
    const flaggedCount = await User.countDocuments({ flagged: true });
    
    const verificationStatus = {
      verified: verifiedCount,
      pending: pendingCount,
      flagged: flaggedCount
    };
    
    // Get login activity data
    let loginActivity;
    let growthData;
    
    if (timeframe === 'today') {
      // Hourly login data for today
      loginActivity = await getHourlyLogins(cutoffDate);
      growthData = loginActivity.map(item => ({
        time: item.hour,
        users: Math.round(Math.random()), // Placeholder for new users by hour
        active: item.count
      }));
    } else if (timeframe === 'week') {
      // Daily login data for week
      loginActivity = await getDailyLogins(cutoffDate);
      growthData = loginActivity.map(item => ({
        time: item.day,
        users: Math.round(Math.random() * 3), // Placeholder for new users by day
        active: item.count
      }));
    } else {
      // Weekly login data for month
      loginActivity = await getWeeklyLogins(cutoffDate);
      growthData = loginActivity.map(item => ({
        time: item.week,
        users: Math.round(Math.random() * 10), // Placeholder for new users by week
        active: item.count
      }));
    }
    
    res.status(200).json({
      newUsers,
      activeUsers,
      byRole,
      verificationStatus,
      ...(timeframe === 'today' ? { hourlyLogins: loginActivity } :
         timeframe === 'week' ? { dailyLogins: loginActivity } :
         { weeklyLogins: loginActivity }),
      growth: growthData
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
};

/**
 * Get audit logs with filtering capabilities
 */
export const getAuditLogs = async (req, res) => {
    try {
      const { severity, action, userId, dateRange, limit = 50, page = 1 } = req.query;
      
      // Build query object
      const query = {};
      
      // Apply severity filter
      if (severity && severity !== 'all') {
        query.severity = severity;
      }
      
      // Apply action filter
      if (action && action !== 'all') {
        if (action === 'user-create') {
          query.action = 'create';
          query['details.resource'] = 'user';
        } else if (action === 'user-update') {
          query.action = 'update';
          query['details.resource'] = 'user';
        } else if (action === 'donation-create') {
          query.action = 'create';
          query['details.resource'] = 'donation';
        } else if (action === 'donation-update') {
          query.action = 'update';
          query['details.resource'] = 'donation';
        } else if (action === 'verification') {
          query.action = 'update';
          query['details.field'] = 'verification';
        } else {
          // Simple actions like 'login', 'flag', etc.
          query.action = action;
        }
      }
      
      // Apply user filter
      if (userId) {
        query.user = userId;
      }
      
      // Apply date range filter
      if (dateRange && dateRange !== 'all') {
        const now = new Date();
        let cutoffDate;
        
        switch (dateRange) {
          case 'today':
            cutoffDate = new Date(now.setHours(0, 0, 0, 0));
            query.timestamp = { $gte: cutoffDate };
            break;
          case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            
            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setHours(23, 59, 59, 999);
            
            query.timestamp = { 
              $gte: yesterday,
              $lte: endOfYesterday
            };
            break;
          case 'this-week':
            const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const diff = now.getDate() - dayOfWeek;
            cutoffDate = new Date(now.setDate(diff));
            cutoffDate.setHours(0, 0, 0, 0);
            query.timestamp = { $gte: cutoffDate };
            break;
          case 'this-month':
            cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
            query.timestamp = { $gte: cutoffDate };
            break;
          default:
            // No additional date filtering
        }
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const parsedLimit = parseInt(limit);
      
      // Fetch total count for pagination
      const totalCount = await AuditLog.countDocuments(query);
      
      // Fetch logs with pagination and sorting
      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 }) // Sort by timestamp, newest first
        .skip(skip)
        .limit(parsedLimit)
        .populate('user', 'username email'); // Optionally populate user data
      
      // Return the logs with pagination info
      return res.status(200).json({
        logs,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parsedLimit,
          pages: Math.ceil(totalCount / parsedLimit)
        }
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  };


export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalDonatedAgg] = await Transaction.aggregate([
    { $group: { _id: null, totalKg: { $sum: "$value" } } }
  ]);

  const totalDonated = totalDonatedAgg?.totalKg || 0;

  const totalRoutes = await User.countDocuments({ distributionsCount: { $gt: 0 } });

  // Simulate "coverage areas" using unique coordinates if regions are not defined
  const users = await User.find({}, 'location');
  const locationSet = new Set(users.map(u => u.location?.coordinates?.join(',')));
  const coverageAreas = locationSet.size;

  // Impact Score: a dummy logic (customize)
  const deliveredTx = await Transaction.countDocuments({ confirmed: true });
  const totalTx = await Transaction.countDocuments();
  const impactScore = totalTx ? ((deliveredTx / totalTx) * 100).toFixed(1) : 0;

  res.json({
    totalDonations: `${totalDonated} kg`,
    distributionRoutes: `${totalRoutes} Active`,
    coverageAreas: `${coverageAreas} Regions`,
    impactScore: `${impactScore}%`
  });
});
export const getDashboardAlerts = asyncHandler(async (req, res) => {
  const alerts = [];

  // Check for low food stock in certain areas (mock logic)
  const lowStockRegions = await FoodReq.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: "$region", totalQty: { $sum: "$quantity" } } },
    { $match: { totalQty: { $lt: 100 } } }
  ]);

  lowStockRegions.forEach(region => {
    alerts.push({
      title: `Low Food Supply in ${region._id}`,
      description: `Supplies will last only a few more days in ${region._id}. Consider redirecting.`,
      severity: 'high',
      time: 'Just now'
    });
  });

  // Mock: New Partner logic
  const recentUsers = await User.find({ createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } });
  if (recentUsers.length) {
    alerts.push({
      title: `New Partner Organization: ${recentUsers[0].organizationName}`,
      description: `They've just onboarded. Consider initiating collaboration.`,
      severity: 'info',
      time: 'Today'
    });
  }

  // Mock: Transport issue (based on timeline status)
  const troubledRoutes = await Transaction.find({
    'timeline.status': 'in_transit',
    updatedAt: { $lt: new Date(Date.now() - 6*60*60*1000) }
  });

  if (troubledRoutes.length) {
    alerts.push({
      title: `Delayed Delivery Alert`,
      description: `${troubledRoutes.length} deliveries have transport delays.`,
      severity: 'medium',
      time: 'Today'
    });
  }

  res.json({ alerts });
});
export const getRecentDonations = asyncHandler(async (req, res) => {
  const donations = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('donor', 'organizationName') // Only get donor name
    .lean();

  const formatted = donations.map(tx => ({
    organization: tx.donor?.organizationName || 'Anonymous',
    amount: `${tx.value} kg`,
    type: tx.certificateData?.foodType || 'Mixed',
    timestamp: formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })
  }));

  res.json({ recentDonations: formatted });
});

export const getUpcomingDistributions = asyncHandler(async (req, res) => {
  const now = new Date();

  const upcoming = await Transaction.find({
    'timeline.status': { $ne: 'delivered' },
    createdAt: { $gte: now },
  })
    .sort({ createdAt: 1 })
    .limit(5)
    .populate('ngo', 'organizationName')
    .lean();

  const formatted = upcoming.map(item => ({
    location: item.ngo?.organizationName || 'Unknown Location',
    time: new Date(item.createdAt).toLocaleString(), // or use item.timeline timestamps
    peopleServed: `~${item.peopleServed || 0} people`,
    status: item.timeline?.slice(-1)[0]?.status === 'in_transit'
      ? 'On schedule'
      : item.timeline?.slice(-1)[0]?.status === 'pending'
      ? 'Needs volunteers'
      : 'Transport issue'
  }));

  res.json({ upcomingDistributions: formatted });
});

