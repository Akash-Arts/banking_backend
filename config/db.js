const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");

    const exists = await User.findOne({ role: "admin" });
    if (!exists) {
      await User.create({
        role: "admin",
        name: "Akash",
        email: "akashtamil084@gmail.com",
        password: await bcrypt.hash("admin123", 10),
        status: "ACTIVE",
      });
      console.log("Admin Created");
    }
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
