import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

// Define endpoints based on Assignment table [cite: 30]
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
