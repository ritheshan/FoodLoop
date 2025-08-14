import cron from "node-cron";
import { matchFoodListings } from "../controllers/transactions.controller.js";
import express from "express";

// Dummy req/res objects for standalone execution
const req = express.request;
const res = {
  status: () => ({ json: () => {} }),
};

// ⏱ Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Running food listing match job...");
  try {
    await matchFoodListings(req, res);
    console.log("✅ Matching done");
  } catch (err) {
    console.error("❌ Matching failed:", err);
  }
});
