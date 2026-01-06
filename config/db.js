const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const mongodb_url = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongodb_url);
    console.log("MongoDB Connected");

    // CREATE DEFAULT ADMIN
    const exists = await User.findOne({ role: "admin" });

    if (!exists) {
      await User.create({
        role: "admin",
        name: "Akash",
        email: "akashtamil084@gmail.com",
        loginOtp: null,
        otpExpiresAt: new Date(),
        password: await bcrypt.hash("admin123", 10),
      });

      console.log("Admin Created Successfully");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("DB Error:", error.message);
  }
};

module.exports = connectDB;
