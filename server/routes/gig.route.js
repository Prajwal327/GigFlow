import express from "express";
// 1. Add 'updateGig' to imports
import { createGig, deleteGig, getGig, getGigs, getMyGigs, updateGig } from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getGigs);
router.get("/my", verifyToken, getMyGigs);
router.get("/:id", getGig);
router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);

// 2. Add this PUT route for editing
router.put("/:id", verifyToken, updateGig);

export default router;