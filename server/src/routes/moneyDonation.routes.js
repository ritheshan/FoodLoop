
import express from "express";
import { createDonation, verifyPayment, getDonors , failPayment , cleanup } from "../controllers/moneyDonations.controller.js";

const router = express.Router();

router.post("/create-order", createDonation);
router.post("/verify-payment", express.json({ type: "application/json" }), verifyPayment);
router.get("/donors", getDonors);
router.post("/fail-payment", express.json({ type: "application/json" }), failPayment);
router.post("/cleanup", express.json({ type: "application/json" }), cleanup);

export default router;
