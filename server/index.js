import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Import Routes
import authRoute from "./routes/auth.route.js";
import bidRoute from "./routes/bid.route.js";
import gigRoute from "./routes/gig.route.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

// Database Connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/bids", bidRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
  connect();
  console.log("Backend server is running!");
});