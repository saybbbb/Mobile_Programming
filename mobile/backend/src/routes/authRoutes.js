import express from "express";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';


const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { Email, Password, Fullname, PhoneNumber} = req.body;
        if (!Email || !Password || !Fullname || !PhoneNumber) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        if (Password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        
        const existingEmail = await User.findOne({ Email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const existingPhoneNumber = await User.findOne({ PhoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const ProfileImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=${Email}";

        const newUser = new User({
            Email,
            Password,
            Fullname,
            PhoneNumber,
        });

        await newUser.save();

    } catch (error) {
        
    }
});

router.post("/login", async (req, res) => {
    res.send("Login");
});


export default router;