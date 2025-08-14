// models/Donation.js
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  paymentId: String,
  remark: String,
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("moneyDonation", donationSchema);