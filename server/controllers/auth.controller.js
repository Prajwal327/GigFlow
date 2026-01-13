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

    // 3. Create Token (Using JWT_KEY to match your .env)
    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller }, 
      process.env.JWT_KEY, 
      { expiresIn: "1d" }
    );

    // 4. Send Cookie
    // We separate the password from the rest of the user data
    const { password: userPassword, ...info } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true, // ⚠️ REQUIRED for Vercel/Render (HTTPS)
        sameSite: "none", // ⚠️ REQUIRED for Cross-Site cookies
      })
      .status(200)
      .send(info); // Now 'info' is defined above, so this will work!
      
  } catch (err) {
    console.log("LOGIN ERROR:", err);
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