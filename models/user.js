const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    name: String,
    password: String,
    role: { type: String, default: "user" },
    balance: { type: Number, default: 0 },
    status: { type: String, default: "PENDING" },
    googleVerified: { type: Boolean, default: false },
    profilePic: { type: String },
    loginOtp: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
