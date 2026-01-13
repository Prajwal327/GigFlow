import mongoose from "mongoose";

const GigSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  
  // NEW FIELD
  category: { 
    type: String, 
    required: false,
    enum: ["Design", "Development", "Marketing", "Writing", "Animation","Other"], 
    default: "Development" 
  },

  status: {
    type: String,
    enum: ['Open', 'Assigned', 'Completed'],
    default: 'Open',
  },
}, { timestamps: true });

export default mongoose.model("Gig", GigSchema);