import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

// 1. Create a Bid
export const createBid = async (req, res, next) => {
  try {
    if (!req.body.price || !req.body.message) {
      return res.status(400).json({ message: "Price and message are required" });
    }

    const newBid = new Bid({
      gigId: req.body.gigId,
      freelancerId: req.userId,
      message: req.body.message,
      price: req.body.price,
    });
    
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const existingBid = await Bid.findOne({ gigId: req.body.gigId, freelancerId: req.userId });
    if (existingBid) return res.status(400).json({ message: "You have already bid on this gig!" });

    await newBid.save();
    res.status(201).json(newBid);
  } catch (err) {
    res.status(500).json({ message: "Error placing bid" });
  }
};

// 2. Get Bids for a Gig (Owner View)
export const getBidsByGig = async (req, res, next) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId }).populate("freelancerId", "name email");
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bids" });
  }
};

// 3. Get My Bids (Freelancer View)
export const getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ freelancerId: req.userId }).populate("gigId");
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my bids" });
  }
};

// 4. Hire Logic (Updated with Real-time Notifications)
export const hireFreelancer = async (req, res, next) => {
  const { bidId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const winningBid = await Bid.findById(bidId).session(session);
    if (!winningBid) throw new Error("Bid not found");

    const gig = await Gig.findById(winningBid.gigId).session(session);
    
    // Check for Race Condition (Bonus 1)
    if (gig.status === "Assigned") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Gig already assigned!" });
    }

    winningBid.status = "Hired";
    await winningBid.save({ session });

    gig.status = "Assigned";
    await gig.save({ session });

    await Bid.updateMany(
        { gigId: winningBid.gigId, _id: { $ne: bidId } },
        { status: "Rejected" },
        { session }
    );

    await session.commitTransaction();

    // --- NEW: SEND REAL-TIME NOTIFICATION (Bonus 2) ---
    // We check if the freelancer is online using the Map we created in index.js
    if (req.onlineUsers && req.io) {
      const freelancerSocketId = req.onlineUsers.get(winningBid.freelancerId.toString());
      
      if (freelancerSocketId) {
        req.io.to(freelancerSocketId).emit("notification", {
          type: "hired",
          message: `Congratulations! You have been hired for: ${gig.title}`,
          gigId: gig._id
        });
      }
    }
    // --------------------------------------------------

    res.status(200).json({ message: "Freelancer hired successfully!" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};