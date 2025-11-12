import express from "express";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (Email) => {
  return jwt.sign({ Email }, process.env.JWT_SECRET, { expiresIn: "15d" });
};


router.post("/register", async (req, res) => {
  try {
    const { Email, Password, Fullname, PhoneNumber } = req.body || {};
    if (!Email || !Password || !Fullname || !PhoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (Password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingEmail = await User.findOne({ Email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const existingPhoneNumber = await User.findOne({ PhoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ error: "Phone Number already in use" });
    }

    const ProfileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Email}`;

    const newUser = new User({
      Email,
      Password,
      Fullname,
      PhoneNumber,
      ProfileImage,
    });

    await newUser.save();

    const token = generateToken(Email);
    res.status(201).json({
      token,
      Email,
      Fullname,
    });
  } catch (error) {
    console.error("Error in register Route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body || {};
    if (!Email || !Password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    
    const isPasswordValid = await user.comparePassword(Password);
    if (!isPasswordValid) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    const token = generateToken(user.Email);
    res.status(201).json({
      token,
      Email: user.Email,
      Fullname: user.Fullname,
    });
  } catch (error) {
    console.error("Error in login Route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
