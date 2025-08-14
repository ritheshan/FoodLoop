import RecurringDonation from "../models/recurringDonation.model.js";
import FoodListing from "../models/listing.model.js";
import { predictCategory } from "../services/mlClient.js";

export const createRecurring = async (req, res) => {
  try {
    const {
      foodType, // e.g. "dal rice"
      storage, // "room temp" | "refrigerated" | "frozen"
      frequency, // "daily" | "weekly" | "monthly"
      startDate, // ISO date string
      weight, // e.g. "2 kg"
    } = req.body;
    console.log("--------------------------------------"+req.body)
    // 1) Call your ML service exactly like your `predictCategory` signature
    const predictedCategory = await predictCategory(foodType, 0, storage);

    // 2) Build & save the recurring donation entry
    const recurring = await RecurringDonation.create({
      donor: req.user._id,
      foodType,
      storage,
      frequency,
      startDate,
      weight,
      predictedCategory, // e.g. "lunch", "snack", etc.
      nextScheduled: new Date(startDate),
    });

    return res.status(201).json({ success: true, recurring });
  } catch (err) {
    console.error("createRecurring error:", err);
    return res.status(500).json({
      success: false,
      message: "Error setting up recurring donation",
    });
  }
};

export const triggerScheduledDonations = async () => {
  const today = new Date();
  const recurs = await RecurringDonation.find({ isActive: true });

  for (const entry of recurs) {
    if (entry.nextScheduled <= today) {
      // Create donation
      await FoodListing.create({
        donor: entry.donor,
        foodType: entry.foodType,
        weight: entry.weight,
        expirationDate: new Date(
          Date.now() + entry.expirationEstimate * 3600000
        ),
        storage: entry.storage,
        isPerishable: true,
        status: "pending",
      });

      // Update nextScheduled
      const interval =
        entry.frequency === "daily" ? 1 : entry.frequency === "weekly" ? 7 : 30;
      entry.nextScheduled = new Date(today.setDate(today.getDate() + interval));
      await entry.save();
    }
  }
};
export const getMyRecurring = async (req, res) => {
  try {
    const recurs = await RecurringDonation.find({ donor: req.user._id });
    res.status(200).json({ success: true, recurs });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reminders" });
  }
};
// controllers/recurringController.js

export const updateRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      foodType,
      frequency,
      startDate,
      weight,
      storage
    } = req.body;
    console.log("user ------>", req.user._id)
    const updated = await RecurringDonation.findOneAndUpdate(
      { _id: id, donor: req.user._id },
      {
        foodType,
        frequency,
        startDate,
        weight,
        storage,
        nextScheduled: new Date(startDate),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }

    return res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error("updateRecurring error:", err);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};
