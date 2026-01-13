import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Hired", "Rejected"], // [cite: 33]
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Bid", BidSchema);