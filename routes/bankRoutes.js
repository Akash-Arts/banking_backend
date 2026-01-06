const express = require("express");
const User = require("../models/user");
// const mailer = require("../config/mail");
const resend = require("../config/mail");

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

  // await mailer.sendMail({
  //   to: user.email,
  //   subject: "Deposit Success",
  //   text: `Deposited: ${amount}\nTotal: ${user.balance}\n${new Date()}`,
  // });
  await resend.emails.send({
    from: "Banking App <onboarding@resend.dev>",
    to: ["akashtamil084@gmail.com", user.email],
    subject: "Deposit Successful",
    html: `
    <h3>Deposit Alert</h3>
    <p>Amount Deposited: ₹${amount}</p>
    <p>Total Balance: ₹${user.balance}</p>
    <p>Date: ${new Date().toLocaleString()}</p>
  `,
  });

  res.json({ msg: "Deposit successful", balance: user.balance });
});

router.post("/withdraw", async (req, res) => {
  try {
    const { id, amount } = req.body;
    const user = await User.findById(id);

    if (user.balance < amount)
      return res.status(400).json({ msg: "Insufficient balance" });

    user.balance -= amount;
    await user.save();

    // await mailer.sendMail({
    //   to: user.email,
    //   subject: "Withdrawal Success",
    //   text: `Withdrawn: ${amount}\nBalance: ${user.balance}\n${new Date()}`,
    // });
    await resend.emails.send({
      from: "Banking App <onboarding@resend.dev>",
      to: ["akashtamil084@gmail.com", user.email],
      subject: "Withdrawal Successful",
      html: `
    <h3>Withdrawal Alert</h3>
    <p>Amount Withdrawn: ₹${amount}</p>
    <p>Remaining Balance: ₹${user.balance}</p>
    <p>Date: ${new Date().toLocaleString()}</p>
  `,
    });

    res.json({ msg: "Withdrawal successful", balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
