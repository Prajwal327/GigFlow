import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
  type: String,
  required: false,
},
  // Roles are fluid, but we can track if they are mostly a client or freelancer if needed later.
  // For now, every user can do both.
}, { timestamps: true });

export default mongoose.model("User", UserSchema);