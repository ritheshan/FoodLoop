import express from "express";
import cache from "../middleware/cache.middleware.js";
import { getPackagingSuggestions} from "../controllers/pack.controller.js";

const router = express.Router();

router.get("/packaging/:listingId", cache("packaging"), getPackagingSuggestions);
//router.get("/disposal/:transactionId", cache("disposal"), getDisposalInstructions);

export default router;
