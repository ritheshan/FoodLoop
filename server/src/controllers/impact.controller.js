// src/controllers/impact.controller.js
import asyncHandler from '../utils/asynchandler.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';

export const getImpactStats = asyncHandler(async (req, res) => {
  const totalStats = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        totalWeight: { $sum: '$value' },
      }
    }
  ]);

  const total = totalStats[0] || { totalDonations: 0, totalWeight: 0 };
  const estimatedCO2Saved = Math.round(total.totalWeight * 0.35);

  const blockchainTransactions = await Transaction.countDocuments({
    transactionHash: { $exists: true, $ne: null }
  });

  const connectedNGOs = await User.countDocuments({ role: 'NGO' });

  const testimonials = [
    {
      name: "Grace Home NGO",
      quote: "The donations from FoodLoop helped us feed 150 people last month. We feel seen and supported."
    },
    {
      name: "Akhil",
      role: "Volunteer",
      quote: "We've never had such transparency and ease with food donations before. The blockchain proof is game-changing."
    },
    {
      name: "John Doe",
      organizationName: "Food For All Foundation",
      quote: "The platform has transformed how we receive food donations, making the process more efficient and transparent."
    }
  ];

  res.status(200).json({
    totalDonations: total.totalDonations,
    totalWeight: total.totalWeight,
    estimatedCO2Saved,
    blockchainTransactions,
    connectedNGOs,
    testimonials
  });
});
export const getDonationTrends = asyncHandler(async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1); // Jan 1st this year

  const monthlyData = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: start }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  // Map month numbers to names
  const monthMap = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  const donationStats = Array.from({ length: 12 }, (_, i) => ({
    month: monthMap[i + 1],
    donations: 0,
  }));

  monthlyData.forEach(({ _id, count }) => {
    donationStats[_id - 1].donations = count;
  });

  res.status(200).json({ donationStats });
});

// Add this in your `impact.controller.js`
export const getDonationGrowth = asyncHandler(async (req, res) => {
  try {
    const monthlyGrowthData = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } // last 12 months
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          donations: { $sum: "$value" },  // Assuming `value` is the weight or amount donated
        }
      },
      { $sort: { "_id": 1 } } // Sort by month
    ]);

    res.status(200).json({ monthlyGrowth: monthlyGrowthData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donation growth." });
  }
});
export const getUserTrust = asyncHandler(async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const activeDonors = await User.countDocuments({
      role: 'donor',
      totalDonated: { $gt: 0 },  // Assuming `totalDonated` tracks total donation amounts
    });

    const trustPercentage = Math.round((activeDonors / totalDonors) * 100);

    res.status(200).json({ trustPercentage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user trust." });
  }
});