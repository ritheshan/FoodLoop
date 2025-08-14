import User from '../models/user.model.js';
import FoodListing from '../models/listing.model.js';
import Transaction from '../models/transaction.model.js';
import { sendSMS } from "../services/notificationService.js";
import { findNearestVolunteer } from "../utils/volunteerMatcher.js";

export const claimDonation = async (req, res) => {
  try {
    console.log("🔍 Claiming donation ID:", req.params.id);
    console.log("👤 Authenticated user:", req.user);

    const listing = await FoodListing.findById(req.params.id).populate('donor', 'name email contactNumber');

    if (!listing) {
      return res.status(404).json({ error: "Donation not found" });
    }

    if (listing.status !== "pending") {
      return res.status(400).json({ error: "Donation not available for claim" });
    }

    // Update listing with claim details
    listing.status = "requested";
    listing.ngoId = req.user._id;

    let assignedVolunteer = null;

    if (req.body.requestVolunteer) {
      assignedVolunteer = await findNearestVolunteer(listing.location);
      if (assignedVolunteer) {
        listing.volunteer = assignedVolunteer._id;
        console.log(`📍 Assigned volunteer: ${assignedVolunteer.name}`);
      } else {
        console.warn("⚠️ No nearby volunteer found");
      }
    }

    await listing.save();

  // Prepare partial certificateData (finalized later during delivery)
const certificateData = {
  transactionHash: "pending",
  nftTokenId: "pending",
  donorName: listing.donor.name,
  donorEmail: listing.donor.email,
  foodType: listing.foodType,
  weight: listing.weight,
  location: listing.fullAddress || `Lat: ${listing.location.coordinates[1]}, Lng: ${listing.location.coordinates[0]}`,
  timestamp: new Date(),  // final delivery time will be updated later
  date: new Date().toLocaleDateString()
};

    const transaction = new Transaction({
      foodListing: listing._id,
      donor: listing.donor._id,
      ngo: req.user._id,
      volunteer: assignedVolunteer ? assignedVolunteer._id : null,
      timeline: [{ status: "requested", by: "ngo", at: new Date() }],
      certificateData // partial data stored now
    });

    await transaction.save();

    // ✅ Send SMS notifications
    const transactionId = transaction._id.toString();

    await sendSMS(
      listing.donor.contactNumber,
      `🎉 Hi ${listing.donor.name}, your donation (ID: ${transactionId}) has been claimed! Thank you for your generosity.`
    );

    await sendSMS(
      req.user.contactNumber,
      `✅ Hi ${req.user.name}, you’ve successfully claimed donation (ID: ${transactionId}).`
    );

    if (assignedVolunteer) {
      await sendSMS(
        assignedVolunteer.contactNumber,
        `🚚 Hi ${assignedVolunteer.name}, you’ve been confirmed to deliver donation (ID: ${transactionId}).`
      );
    }

    res.status(200).json({
      message: "Donation claimed and transaction created successfully",
      listing,
      transaction,
    });
  } catch (error) {
    console.error("🚨 Error in claimDonation:", error);
    res.status(500).json({ error: "Error claiming donation" });
  }
};

export const updatePreferences = async (req, res) => {
    try {
      const userId = req.user._id;
      const { foodPreferences, needsVolunteer } = req.body;
  
      // Optional: Verify the user is NGO
      const user = await User.findById(userId);
      if (!user || user.role !== 'NGO') {
        return res.status(403).json({ success: false, message: 'Only NGOs can update preferences' });
      }
  
      // Update only if fields are provided
      if (Array.isArray(foodPreferences)) {
        user.foodPreferences = foodPreferences;
      }
  
      if (typeof needsVolunteer === 'boolean') {
        user.needsVolunteer = needsVolunteer;
      }
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        updatedFields: {
          foodPreferences: user.foodPreferences,
          needsVolunteer: user.needsVolunteer,
        },
      });
    } catch (err) {
      console.error('Preference update error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };