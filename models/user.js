const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["admin", "user"], required: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 0 },
  ifsc: { type: String, default: "********" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
