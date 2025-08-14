
import { razorpayInstance } from "../utils/razorpay.js";
import Donation from "../models/moneyDonation.model.js";
import crypto from "crypto";

export const createDonation = async (req, res) => {
  try {
    const { name, email, amount } = req.body;
    console.log("Creating donation order:", { name, email, amount });

    // Save pending donation in DB
    const donation = await Donation.create({ name, email, amount, status: "pending" });

    // Create Razorpay order
    const options = {
      amount: amount * 100, // INR in paise
      currency: "INR",
      receipt: `receipt_${donation._id}`,
    };
    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay order created:", order);
    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID, donationId: donation._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
 try {
    console.log("Verifying payment with data:", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Payment signature verified successfully");
      await Donation.findByIdAndUpdate(donationId, {
        paymentId:razorpay_payment_id,
        status: "success",
        remark: "Payment successful"
      });
      res.json({ status: "success" });
    } else {
      await Donation.findByIdAndUpdate(donationId, {
        razorpay_payment_id,
        status: "failed",
        remark: "Invalid signature"
      });
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDonors = async (req, res) => {
  const donors = await Donation.find({ status: "success" }).sort({ createdAt: -1 }).limit(20);
  res.json(donors);
};
export const failPayment = async (req, res) => {
  const { donationId, reason } = req.body;
  await Donation.findByIdAndUpdate(donationId, { status: "failure", remark: reason });
  res.json({ status: "failure" });
};
export const cleanup = async (req, res) => {
  try {
    const expiredDonations = await Donation.updateMany(
      { status: "pending", createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      { status: "failure", remark: "Payment not completed in 24 hours" }
    );
    res.json({ updated: expiredDonations.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
