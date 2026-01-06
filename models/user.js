const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    password: String,
    role: String,
    balance: Number,
    loginOtp: String,
    otpExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
