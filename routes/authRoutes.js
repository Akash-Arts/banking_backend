require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email not registered" });
    }

    if (user.role === "admin") {
      if (!user.password) {
        return res.status(400).json({ msg: "Password not set" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }

      return res.json({
        msg: "Admin login successful",
        role: user.role,
        userId: user._id,
        name: user.name,
      });
    }

    if (user.role === "user") {
      if (user.status !== "ACTIVE") {
        return res.status(403).json({ msg: "Account not active" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.loginOtp = otp;
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      return res.json({
        msg: "Verification code sent to email",
      });
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/create-user", async (req, res) => {
  try {
    const { name, email, balance } = req.body;
    const hashed = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email,
      name,
      balance,
      password: hashed,
      role: "user",
      googleVerified: false,
      password: null,
    });
    res.json({ msg: "User Created, Google verification pending." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/google-verify", async (req, res) => {
//   try {
//     const { token } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const email = payload.email;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(403).json({ message: "User not invited by admin" });
//     }

//     user.googleVerified = true;
//     user.status = "ACTIVE";
//     await user.save();

//     res.json({ message: "Google account verified successfully" });
//   } catch (err) {
//     res.status(401).json({ message: "Invalid Google token" });
//   }
// });

// router.post("/set-password", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user || !user.googleVerified) {
//     return res.status(403).json({ message: "Google verification required" });
//   }

//   user.password = await bcrypt.hash(password, 10);
//   await user.save();

//   res.json({ message: "Password set successfully" });
// });

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid request" });
    }

    if (!user.loginOtp || !user.otpExpiresAt) {
      return res.status(400).json({ msg: "OTP not requested" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (user.loginOtp !== otp) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    user.loginOtp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({
      msg: "Login successful",
      userId: user._id,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
