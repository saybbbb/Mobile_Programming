import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) => {
	return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15d'})
}

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email address already taken" });
		}

		const existingPhoneNumber = await User.findOne({ phoneNumber });
		if (existingPhoneNumber) {
			return res.status(400).json({ message: "Phone number already taken" });
		}

		const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

		const user = new User({
			fullName,
			email,
			password,
			phoneNumber,
			profileImage,
		});

		await user.save();

		const token = generateToken(user._id);
		res.status(201).json({
			token,
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				phoneNumber: user.phoneNumber
			},
		});

  } catch (error) {
		console.log("Error in register route:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) return res.status(400).json({ message: "All fields are required" });

		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid Credentials" });

		const isPasswordCorrect = await user.comparePassword(password);
		if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

		const token = generateToken(user._id);
		res.status(201).json({
			token,
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				phoneNumber: user.phoneNumber
			},
		});

	} catch (error) {
		console.log("Error in login route:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
