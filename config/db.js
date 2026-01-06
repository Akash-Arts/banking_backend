const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const mongodb_url = "mongodb://127.0.0.1:27017/banking";

const connectDB = async () => {
  try {
    await mongoose.connect(mongodb_url);
    console.log("MongoDB Connected");

    // CREATE DEFAULT ADMIN
    const exists = await User.findOne({ role: "admin" });

    if (!exists) {
      await User.create({
        role: "admin",
        name: "Admin",
        email: "admin@gmail.com",
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
