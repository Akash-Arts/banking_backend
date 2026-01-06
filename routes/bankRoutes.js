const express = require("express");
const User = require("../models/user");
// const mailer = require("../config/mail");
// const resend = require("../config/mail");

const router = express.Router();

router.get("/admin/getusers", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch users",
      error: error.message,
    });
  }
});
router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id); // <-- FIXED
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      user, // send single object
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch user",
      error: error.message,
    });
  }
});

router.post("/deposit", async (req, res) => {
  const { id, amount } = req.body;
  const user = await User.findById(id);
  user.balance += Number(amount);
  await user.save();

  const message = `Deposit successful! Amount: ₹${amount}, Current Balance: ₹${user.balance}`;

  res.status(200).json({ message, balance: user.balance, mailId: user.email });
});

router.post("/withdraw", async (req, res) => {
  try {
    const { id, amount } = req.body;
    const user = await User.findById(id);

    if (user.balance < amount)
      return res.status(400).json({ msg: "Insufficient balance" });

    user.balance -= amount;
    await user.save();

    const message = `Withdrawal successful! Amount: ₹${amount}, Current Balance: ₹${user.balance}`;

    res
      .status(200)
      .json({ message, balance: user.balance, mailId: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
