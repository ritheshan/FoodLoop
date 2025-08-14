import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import FoodListing from '../models/listing.model.js';
import Transaction from '../models/transaction.model.js';
import { predictCategory } from '../services/mlClient.js';

import fs from 'fs';
import { uploadToCloudinary } from '../utils/cloudinary.js';


export const createDonation = async (req, res) => {
  try {
    console.log("🛬 Incoming donation request...");
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files || req.file);
    console.log("Authenticated user:", req.user);
    
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }

    const donorId = req.user._id;

    const {
      foodDescription,
      title,
      hoursOld,
      storage,
      weight,
      expirationDate,
      lat,
      lng,
      scheduledFor,
      fullAddress,  // Include the full address from request body
    } = req.body;

    // Location setup
    const location = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    // ML prediction (fallback safe)
    let predictedCategory = 'other';
    try {
      predictedCategory = await predictCategory(foodDescription, hoursOld, storage);
    } catch (e) {
      console.warn('ML fallback: "other"', e);
    }

    const isPerishable = storage !== 'room temp';

    // Image uploads
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        imageUrls.push(result.secure_url);

        // Remove local file after upload
        fs.unlink(file.path, (err) => {
          if (err) console.error("File delete failed:", err);
        });
      }
    }

    // Create the donation including the full address
    const donation = await FoodListing.create({
      donor: donorId,
      foodType : title,
      location,
      foodDescription,
      predictedCategory,
      hoursOld,
      storage,
      weight,
      expirationDate,
      scheduledFor,
      images: imageUrls,
      isPerishable,
      fullAddress,  // Store the full address received from the frontend
    });

    res.status(201).json({ success: true, donation });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Could not create donation',
      details: error.message
    });
  }
};

export const cancelDonation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const donation = await FoodListing.findById(id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Only donor can cancel & only if status is pending
    if (donation.donor.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this donation' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending donations can be cancelled' });
    }

    await FoodListing.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Donation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling donation:', error);
    return res.status(500).json({ message: 'Server error while cancelling donation' });
  }
};

export const getDonations = async (req, res) => {
  try {
    const matchedListings = await Transaction.find().distinct('foodListing');

    const donations = await FoodListing.find({
      status: 'pending',
      _id: { $nin: matchedListings }
    }).populate('donor', 'name');
    console.log("Fetched donations:", donations);

    const formattedDonations = donations.map(donation => ({
      _id: donation._id, // ✅ Add this line
      foodType: donation.foodType || 'Food',
      name: donation.donor?.name || 'Anonymous',
      tags: donation.items?.flatMap(item => item.name) || [],
      location: donation.location?.coordinates 
        ? `Lat: ${donation.location.coordinates[1]}, Lng: ${donation.location.coordinates[0]}`
        : 'N/A',
      expiryDate: donation.expirationDate,
      adress : donation.fullAddress || 'N/A', // Use fullAddress if available
      images: donation.images || [],
    }));

    res.json({ success: true, data: formattedDonations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ success: false, error: 'Error fetching donations' });
  }
};
export const getUserDonations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch donations and populate foodListing and certificateData
        const donations = await Transaction.find({ donor: userId })
            .populate('foodListing')
            .populate('ngo')         
            .select('foodListing ngo transactionHash certificateData')

        // Sending donations with certificateData included
        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user donations' });
    }
};

