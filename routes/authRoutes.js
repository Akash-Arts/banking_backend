const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email not registered" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // 3. Success response
    res.json({
      msg: "Login successful",
      role: user.role,
      userId: user._id,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/create-user", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({ ...req.body, password: hashed, role: "user" });
  res.json({ msg: "User Created" });
});

module.exports = router;
