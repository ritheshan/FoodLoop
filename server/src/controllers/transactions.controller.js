import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Transaction from "../models/transaction.model.js";
import FoodListing from "../models/listing.model.js";
import User from "../models/user.model.js";
import redisClient from "../utils/redis.js";
import { sendSMS } from "../services/notificationService.js";

import { web3, contract, account } from "../utils/blockchain.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
// Load ABI manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const abiPath = path.join(
  __dirname,
  "../../blockchain/build/contracts/FoodLoop.json"
);
const foodLoopAbi = JSON.parse(await readFile(abiPath, "utf-8"));

import nodemailer from "nodemailer";
import fs from "fs";

import { validationResult } from "express-validator";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (email, name, message, confirmUrl, rejectUrl) => {
  const htmlPath = path.join(__dirname, "../views/confirmation.html");
  let html = fs.readFileSync(htmlPath, "utf8");

  html = html
    .replace("{{name}}", name)
    .replace("{{message}}", message)
    .replace("{{confirmUrl}}", confirmUrl)
    .replace("{{rejectUrl}}", rejectUrl);

  await transporter.sendMail({
    from: `"FoodLoop Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Please Confirm Participation",
    html,
  });
};


export const matchFoodListings = async (req, res) => {
  try {
    const now = new Date();

    // 1) Find all eligible listings
    const listings = await FoodListing.find({
      status: 'pending',
      scheduledFor: { $lte: now },
    })
      .sort({ isPerishable: -1, scheduledFor: 1 })
      .populate('donor');

    const matched = [];

    for (const listing of listings) {
      // 2) Skip if already has a pending or confirmed transaction
      const existingTx = await Transaction.findOne({
        foodListing: listing._id,
        status:     { $in: ['pending', 'confirmed'] }
      });
      if (existingTx) continue;

      // 3) Find closest NGO (with simple redisClient cache)
      const cacheKey = `ngo-near:${listing._id}`;
      let closestNGO = null;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const ngo = JSON.parse(cached);
        if (!ngo.foodPreferences.includes(listing.foodType)) {
          closestNGO = await User.findById(ngo._id);
        }
      }

      if (!closestNGO) {
        const ngos = await User.find({
          role: 'NGO',
          location: {
            $near: {
              $geometry: listing.location,
              $maxDistance: 500
            }
          }
        });
        for (const ngo of ngos) {
          if (!ngo.foodPreferences.includes(listing.foodType)) {
            closestNGO = ngo;
            // cache minimal info
            await redisClient.set(cacheKey, JSON.stringify({
              _id: ngo._id.toString(),
              foodPreferences: ngo.foodPreferences
            }), 'EX', 300);
            break;
          }
        }
      }
      if (!closestNGO) continue;

      // 4) Find closest available volunteer if needed
      let closestVolunteer = null;
      if (listing.requiresVolunteer || closestNGO.needsVolunteer) {
        const day  = now.toLocaleDateString('en-US', { weekday: 'long' });
        const hour = now.getHours();

        closestVolunteer = await User.findOne({
          role: 'volunteer',
          location: {
            $near: {
              $geometry: listing.location,
              $maxDistance: 10000
            }
          },
          availability: {
            $elemMatch: {
              day,
              startHour: { $lte: hour },
              endHour:   { $gte: hour }
            }
          }
        });
      }

      // 5) Create the "requested" transaction
      const tx = await Transaction.create({
        foodListing: listing._id,
        donor:       listing.donor._id,
        ngo:         closestNGO._id,
        volunteer:   closestVolunteer?._id || null,
        status:      'pending',
        confirmedBy: []          // will accumulate NGO/volunteer IDs on confirm
      });

      // 6) Update the listing so it's no longer re-matched
      listing.status    = 'requested';
      listing.volunteer = closestVolunteer?._id || null;
      await listing.save();

      // 7) Send confirmation emails
      const base = 'https://foodloop-72do.onrender.com';
      // NGO
      await sendConfirmationEmail(
        closestNGO.email,
        closestNGO.name,
        `A new food donation is available for you to claim.`,
        `${base}/confirm/${tx._id}/${closestNGO._id}`,
        `${base}/reject/${tx._id}/${closestNGO._id}`
      );
      // Volunteer (if any)
      if (closestVolunteer) {
        await sendConfirmationEmail(
          closestVolunteer.email,
          closestVolunteer.name,
          `Please confirm you can deliver this donation.`,
          `${base}/confirm/${tx._id}/${closestVolunteer._id}`,
          `${base}/reject/${tx._id}/${closestVolunteer._id}`
        );
      }

      matched.push(tx);
    }

    return res.status(200).json({
      success: true,
      matched: matched.length,
      transactions: matched
    });

  } catch (err) {
    console.error('matchFoodListings error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// transactions.controller.js


/**
 * Get transactions for logged in user
 * @route GET /api/transactions
 */
export const getUserTransactions = async (req, res) => {
  try {
    console.log("🔁 Incoming request to getUserTransactions:", req.user);
    const userId = req.user._id;
    const role = req.user.role.toLowerCase();

    // Build filter based on role
    let filter = {};
    if (role === "donor") {
      filter.donor = userId;
    } else if (role === "ngo") {
      filter.ngo = userId;
    } else if (role === "volunteer") {
      filter.volunteer = userId;
    } else if (role === "admin") {
      // no filter → all transactions
      filter = {};
    } else {
      return res.status(403).json({ success: false, message: "Invalid role" });
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "foodListing",
        select:
          "foodDescription predictedCategory weight location expirationDate status",
      })
      .populate("donor", "name email")
      .populate("ngo", "name email")
      .populate("volunteer", "name email")
      .lean();

    // Format transactions for frontend compatibility
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id, // Explicitly include id for frontend
      _id: transaction._id,
      status: transaction.status,
      donor: transaction.donor,
      ngo: transaction.ngo,
      volunteer: transaction.volunteer,
      foodListing: transaction.foodListing,
      timeline: transaction.timeline || [],
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      transactionHash: transaction.transactionHash,
      confirmed: transaction.confirmed
    }));

    return res.status(200).json(formattedTransactions);
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    return res.status(500).json({ message: "Server error while fetching transactions" });
  }
};

/**
 * Get timeline for a specific order
 * @route GET /api/transactions/orders/:orderId/timeline
 */
export const getOrderTimeline = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const transaction = await Transaction.findById(orderId).lean();

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // 🔒 Authorization check (unless admin)
    const userRole = req.user.role?.toLowerCase();
    const userId = req.user._id.toString();

    if (userRole !== 'admin') {
      const isAuthorized =
        (userRole === 'donor' && transaction.donor?.toString() === userId) ||
        (userRole === 'ngo' && transaction.ngo?.toString() === userId) ||
        (userRole === 'volunteer' && transaction.volunteer?.toString() === userId);

      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized to view this transaction timeline' });
      }
    }

    return res.status(200).json({
      id: transaction._id,
      orderId: transaction._id,
      currentStatus: transaction.status,
      events: [...(transaction.timeline || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    console.error('Error fetching transaction timeline:', error);
    return res.status(500).json({ message: 'Server error while fetching timeline' });
  }
};

/**
 * Update transaction status
 * @route PATCH /api/transactions/:transactionId/status
 */
export const updateOrderStatus = async (req, res) => {
  console.log("🔁 Incoming request to updateOrderStatus:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { transactionId } = req.params;
    const { status, note } = req.body;
    
    const by = req.body.by || req.user.role;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }

    const validStatuses = ['pending', 'requested', 'picked_up', 'in_transit', 'delivered', 'confirmed', 'on_chain'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const validRoles = ['system', 'donor', 'ngo', 'volunteer', 'admin'];
    if (!validRoles.includes(by)) {
      return res.status(400).json({ message: 'Invalid role for status update' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (!transaction.timeline) {
      transaction.timeline = [];
    }

    // ✅ Prevent duplicate timeline entry
    const isDuplicate = transaction.timeline.some(
      entry => entry.status === status && entry.by === by
    );

    let timelineEvent = null;

    if (!isDuplicate) {
      timelineEvent = {
        status,
        timestamp: new Date(),
        by,
        note: note || `Status updated to ${status}`
      };
      transaction.timeline.push(timelineEvent);
    }

    transaction.status = status;

    // Handle timestamps
    if (status === 'delivered') {
      transaction.deliveredAt = new Date();
    } else if (status === 'confirmed') {
      transaction.confirmedAt = new Date();
    }

    await transaction.save();

    return res.status(200).json({
      message: 'Transaction status updated successfully',
      id: transaction._id,
      currentStatus: status,
      timelineEvent,
      transaction: {
        id: transaction._id,
        _id: transaction._id,
        status: transaction.status,
        timeline: transaction.timeline
      }
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return res.status(500).json({ message: 'Server error while updating status' });
  }
};

/**
 * Confirm delivery and mint NFT
 * @route POST /api/transactions/confirm-delivery/:transactionId
 */
// Load deployed contract address
const deployedPath = path.resolve(__dirname, "../../blockchain/deployedAddresses.json");
const { foodLoopAddress } = JSON.parse(fs.readFileSync(deployedPath, "utf-8"));
export const confirmDeliveryAndMintNFT = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId)
      .populate("foodListing")
      .populate("donor")
      .populate("ngo");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Already confirmed and minted
    if (transaction.status === "on_chain" && transaction.transactionHash) {
      return res.status(400).json({
        message: "Transaction already confirmed and NFT minted",
        transactionHash: transaction.transactionHash,
      });
    }

    const { foodListing, donor } = transaction;
    const foodType = transaction.foodListing?.foodType || transaction.certificateData?.foodType || "Unknown food type";
    const weight = foodListing?.weight || 0;
    const location = foodListing?.location?.coordinates
      ? `Lat: ${foodListing.location.coordinates[1]}, Lng: ${foodListing.location.coordinates[0]}`
      : "Location not available";
    const timestamp = new Date().toISOString();
    const role = req.user.role.toLowerCase();

    const deliveryId = BigInt("0x" + transaction._id.toString().slice(-10));
    const donorAddress = process.env.DEFAULT_WALLET;

    // Prevent duplicate confirmation from same role
    const alreadyConfirmed = transaction.timeline.some(
      (entry) => entry.status === "confirmed" && entry.by === role
    );

    const txData = contract.methods.confirmDeliveryAndMintNFT(
      deliveryId,
      donorAddress,
      foodType,
      weight.toString(),
      location,
      timestamp
    );

    const gasLimit = 500000;
    const maxFeePerGas = web3.utils.toWei("50", "gwei");
    const maxPriorityFeePerGas = web3.utils.toWei("2", "gwei");

    const signedTx = await account.signTransaction(
      {
        from: account.address,
        to: foodLoopAddress,
        data: txData.encodeABI(),
        gas: gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
      },
      account.privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    const txHash = receipt.transactionHash;

    // Extract NFT tokenId from Transfer event logs
    const transferSig = web3.utils.sha3("Transfer(address,address,uint256)");
    const transferLog = receipt.logs.find((log) => log.topics[0] === transferSig);
    const tokenId = transferLog ? web3.utils.hexToNumberString(transferLog.topics[3]) : null;

    // Update foodListing status
    if (foodListing) {
      foodListing.status = "confirmed";
      await foodListing.save();
    }

    // Update transaction
    transaction.transactionHash = txHash;
    transaction.status = "on_chain";
    transaction.confirmed = true;

    if (!alreadyConfirmed) {
      transaction.timeline.push({
        status: "confirmed",
        by: role,
        timestamp: new Date().toISOString(),
        note: "Delivery confirmed and NFT minted",
      });
    }

    transaction.certificateData = {
      transactionHash: txHash,
      nftTokenId: tokenId,
      donorName: donor?.name,
      donorEmail: donor?.email,
      foodType,
      weight,
      location,
      timestamp,
      date: new Date().toLocaleString(),
    };

    await transaction.save();

    return res.status(200).json({
      message: "Delivery confirmed and NFT minted on blockchain",
      id: transaction._id,
      certificateData: transaction.certificateData,
    });
  } catch (error) {
    console.error("Blockchain minting error:", error);

    // Fallback: Update transaction without on-chain data
    try {
      const { transactionId } = req.params;
      const transaction = await Transaction.findById(transactionId);
      const role = req.user.role.toLowerCase();

      transaction.status = "confirmed";

      transaction.timeline.push({
        status: "confirmed",
        by: role,
        timestamp: new Date().toISOString(),
        note: "Delivery confirmed but NFT minting failed",
      });

      await transaction.save();

      return res.status(200).json({
        message: "Delivery confirmed but blockchain minting failed",
        id: transaction._id,
        error: error.message,
      });
    } catch (fallbackError) {
      return res.status(500).json({
        message: "Failed to confirm delivery",
        error: fallbackError.message,
      });
    }
  }
};
export const confirmParticipation = async (req, res) => {
  try {
    const { transactionId, userId } = req.params;

    // 1) Load the transaction
    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    // 2) Record this user's confirmation
    const isNGO       = tx.ngo.toString() === userId;
    const isVolunteer = tx.volunteer && tx.volunteer.toString() === userId;

    if (!isNGO && !isVolunteer) {
      return res.status(403).json({ error: 'Not authorised to confirm this transaction' });
    }

    // Avoid duplicate entries
    if (!tx.confirmedBy.includes(userId)) {
      tx.confirmedBy.push(userId);
      await tx.save();
    }

    // 3) Check if all required parties have confirmed
    const ngoConfirmed       = tx.confirmedBy.includes(tx.ngo.toString());
    const volunteerConfirmed = !tx.volunteer || tx.confirmedBy.includes(tx.volunteer.toString());

    if (ngoConfirmed && volunteerConfirmed) {
      // 4) Finalize on-chain status
      tx.status       = 'confirmed';
      tx.confirmedAt  = new Date();
      await tx.save();

      // 5) Update the underlying listing
      const listing = await FoodListing.findById(tx.foodListing).populate('donor');
      listing.status = 'confirmed';
      await listing.save();

      // 6) Fetch users for SMS
      const donor     = listing.donor;
      const ngoUser   = await User.findById(tx.ngo);
      const volunteer = tx.volunteer ? await User.findById(tx.volunteer) : null;

      // 7) Send SMS notifications
      await sendSMS(
        donor.contactNumber,
        `🎉 Hi ${donor.name}, your donation (ID: ${transactionId}) has been confirmed! Thank you for your generosity.`
      );
      await sendSMS(
        ngoUser.contactNumber,
        `✅ Hi ${ngoUser.name}, you’ve successfully claimed donation (ID: ${transactionId}).`
      );
      if (volunteer) {
        await sendSMS(
          volunteer.contactNumber,
          `🚚 Hi ${volunteer.name}, you’ve been confirmed to deliver donation (ID: ${transactionId}).`
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Confirmation received',
      status: tx.status
    });

  } catch (err) {
    console.error('confirmParticipation error:', err);
    return res.status(500).json({ error: 'Server error confirming participation' });
  }
};

export const rejectParticipation = async (req, res) => {
  const { transactionId, userId } = req.params;
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) return res.status(404).send("Transaction not found");

  await Transaction.findByIdAndDelete(transactionId);

  // Re-run matching for this foodListing
  const listing = await FoodListing.findById(transaction.foodListing);
  listing.status = "pending";
  await listing.save();
  await matchFoodListings(); // run again

  return res.send("Sorry to hear that. We’ll look for another match.");
};
