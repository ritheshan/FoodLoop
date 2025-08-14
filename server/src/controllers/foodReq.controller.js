import FoodRequest from "../models/foodReq.model.js";
import axios from "axios";
import Transaction from "../models/transaction.model.js";

/**
 * POST /api/requests
 * Create a new food request (NGO or “forSomeoneElse” user)
 */
export const createFoodRequest = async (req, res) => {
  console.log("this is the user : ",req.user);
  try {
    const data = {
      createdBy: req.user._id,
      forSomeoneElse: req.body.forSomeoneElse,
      organizationName: req.body.organizationName,
      contactPerson: req.body.contactPerson,
      address: req.body.address,
      phone: req.body.phone,
      requestType: req.body.requestType,
      specialOccasion: req.body.specialOccasion,
      celebrationName: req.body.celebrationName,
      itemsNeeded: req.body.itemsNeeded,
      urgencyLevel: req.body.urgencyLevel,
      additionalNotes: req.body.additionalNotes,
    };
    console.log(
      "-------------------------------------------------------------"
    );
    const request = await FoodRequest.create(data);

    // trigger your matching logic on the backend
    // (match incoming requests to available listings)
    axios
      .post(`${process.env.BACKEND_URL}/api/transactions/matchRequest`, {
        requestId: request._id,
      })
      .catch((err) => console.error("MatchRequest error:", err.message));

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error("createFoodRequest:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/requests
 * List all requests for the logged‑in user
 */
export const getUserRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({ createdBy: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, requests });
  } catch (err) {
    console.error("getUserRequests:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/requests/:id
 * Fetch one request (detail & status timeline if you extend)
 */
export const getRequestById = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id).lean();
    if (!request)
      return res.status(404).json({ success: false, message: "Not found" });
    // optionally guard: only creator or admin can view
    res.json({ success: true, request });
  } catch (err) {
    console.error("getRequestById:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role")
      .lean();

    return res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("getAllRequests error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const claimRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Who created this request?
    const creator = await User.findById(request.createdBy);
    if (!creator) {
      return res.status(400).json({ error: "Invalid request creator" });
    }

    // Determine roles
    const creatorRole = creator.role.toLowerCase(); // 'ngo' or 'volunteer'
    const txnData = {
      foodListing: request._id, // reuse this field for request ID
      donor: req.user.userId, // the donor who claims it
      ngo: creatorRole === "ngo" ? creator._id : null,
      volunteer: creatorRole === "volunteer" ? creator._id : null,
      timeline: [{ status: "requested", by: creatorRole }],
    };

    const transaction = await Transaction.create(txnData);

    return res
      .status(201)
      .json({ success: true, message: "Request claimed", transaction });
  } catch (err) {
    console.error("claimRequest error:", err);
    return res.status(500).json({ error: "Could not claim request" });
  }
};
