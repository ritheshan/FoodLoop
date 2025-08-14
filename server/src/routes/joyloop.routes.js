// routes/joyloop.routes.js

import express from "express";
import { 
  postJoyMoment, 
  getJoyMoments, 
  getTopDonors, 
  getJoySpreaders 
} from "../controllers/joyloop.controller.js";
import  {authMiddleware } from "../middleware/authMiddleware.js";
import cache from "../middleware/cache.middleware.js";
import { upload } from "../middleware/multerConfig.js"; // For handling file uploads

const router = express.Router();

// 1. Get recent joy moments (with caching)
router.get("/joy-moments", cache("joyMoments"), getJoyMoments);

// 2. Post a new joy moment (protected route with media upload)
router.post("/post",authMiddleware, upload.single("media"), postJoyMoment);

// 3. Get top donors based on donations
router.get("/top-donors", cache("topDonors"), getTopDonors);

// 4. Get top joy spreaders (based on transaction volunteer/donor/logic)
router.get("/joy-spreaders", cache("joySpreaders"), getJoySpreaders);

// 5. (Optional direct non-cached version for moments, if needed separately)
router.get("/get", getJoyMoments); // alias route

export default router;