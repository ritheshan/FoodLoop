import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import FoodListing from "../models/listing.model.js";
import JoyLoop from "../models/joyloop.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// GET: Top Volunteers (Joy Spreaders)
export const getJoySpreaders = async (req, res) => {
  try {
    const joySpreaders = await JoyLoop.aggregate([
      {
        $group: {
          _id: "$user",
          spreadCount: { $sum: 1 }
        }
      },
      { $sort: { spreadCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          spreadCount: 1
        }
      }
    ]);
console.log("Joy Spreaders:", joySpreaders);
    res.json(joySpreaders);
  } catch (err) {
    console.error("Error fetching joy spreaders:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET: Top Donors
export const getTopDonors = async (req, res) => {
  try {
    const topDonors = await FoodListing.aggregate([
      {
        $group: {
          _id: "$donor",
          totalDonations: { $sum: 1 }
        }
      },
      { $sort: { totalDonations: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donorDetails"
        }
      },
      { $unwind: "$donorDetails" },
      {
        $project: {
          _id: 0,
          donorId: "$donorDetails._id",
          name: "$donorDetails.name",
          email: "$donorDetails.email",
          totalDonations: 1
        }
      }
    ]);

    res.json(topDonors);
  } catch (err) {
    console.error("Error fetching top donors:", err);
    res.status(500).json({ error: "Server error fetching top donors" });
  }
};

// POST: Share a Joy Moment
export const postJoyMoment = async (req, res) => {
  try {
    const { caption } = req.body;
    console.log("Received caption:", req.body);
    console.log("Received file:", req.file);  
    const file = req.file;

    let mediaUrl = "";
    let mediaType = "";

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto"
      });
      mediaUrl = result.secure_url;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";

      fs.unlinkSync(file.path); // cleanup temp file
    }

    const moment = new JoyLoop({
      user: req.user._id,
      caption,
      mediaUrl,
      mediaType
    });

    await moment.save();

    res.status(201).json({ success: true, data: moment });
  } catch (error) {
    console.error("Error posting joy moment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET: All Joy Moments
export const getJoyMoments = async (req, res) => {
  try {
    const moments = await JoyLoop.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("user", "name email avatar");

    const formatted = moments.map(moment => ({
      _id: moment._id,
      caption: moment.caption,
      publicUrl: moment.mediaUrl,        // renamed for frontend consistency
      mediaType: moment.mediaType,
      date: moment.createdAt,
      user: moment.user
    }));

    res.status(200).json({ success: true, data: { momentOfDay: formatted } });
  } catch (error) {
    console.error("Error fetching joy moments:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};