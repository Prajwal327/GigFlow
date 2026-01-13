import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res, next) => {
  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Create new user
    const newUser = new User({
      ...req.body, // This automatically grabs name, email, isSeller, etc.
      password: hashedPassword,
    });

    // 4. Save to DB
    await newUser.save();
    
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    // 2. Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Wrong Credentials!" });

    // ---------------------------------------------------------
    // 🔍 DEBUGGING BLOCK (This will show up in Render Logs)
    // ---------------------------------------------------------
    console.log("--- DEBUGGING ENV VARS ---");
    console.log("Checking JWT_KEY:", process.env.JWT_KEY ? "EXISTS" : "MISSING");
    console.log("Checking JWT_SECRET:", process.env.JWT_SECRET ? "EXISTS" : "MISSING");
    
    // Fallback: Try JWT_KEY first, if missing, try JWT_SECRET
    const secretKey = process.env.JWT_KEY || process.env.JWT_SECRET;
    
    if (!secretKey) {
        throw new Error("FATAL ERROR: No JWT Secret found in Environment Variables!");
    }
    // ---------------------------------------------------------

    // 3. Create Token
    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller }, 
      secretKey, 
      { expiresIn: "1d" }
    );

    // 4. Send Cookie
    const { password: userPassword, ...info } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .send(info);
      
  } catch (err) {
    console.log("LOGIN ERROR:", err); // Log the full error
    next(err);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ message: "User has been logged out." });
};