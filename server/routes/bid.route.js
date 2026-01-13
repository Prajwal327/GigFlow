import express from "express";
import { createBid, getBidsByGig, getMyBids, hireFreelancer } from "../controllers/bid.controller.js"; // Import getMyBids
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createBid);
router.get("/my", verifyToken, getMyBids); // <--- ADD THIS
router.get("/:gigId", verifyToken, getBidsByGig);
router.patch("/:bidId/hire", verifyToken, hireFreelancer);

export default router;