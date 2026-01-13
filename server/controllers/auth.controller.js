import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
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

    // 3. Create Token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // 4. Send Cookie [cite: 12]
    // We send only necessary info (exclude password)
    const { password: userPassword, ...otherDetails } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true, // Crucial for security: prevents JS from reading the cookie
        secure: false, // Set to 'true' if using HTTPS (production), 'false' for localhost
        sameSite: "strict",
      })
      .status(200)
      .json(otherDetails);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
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