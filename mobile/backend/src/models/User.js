import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

    Email: {
        type: String,
        required: true,
        unique: true,
    },

    Password: {
        type: String,
        required: true,
        minlength: 6,

    },

    Fullname: {
        type: String,
        required: true,

    },

    PhoneNumber: {
        type: int,
        required: true,

    },

    ProfileImage:{
        type: String,
        default: "null",
    }


})


userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
})

const User = mongoose.model("User", userSchema);

export default User;    