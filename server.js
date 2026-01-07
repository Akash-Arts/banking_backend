require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const reportRoutes = require("./routes/reportRoutes.js");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use("/uploads", express.static("uploads"));
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bank", require("./routes/bankRoutes"));
app.use("/api/transaction", require("./routes/transactionRoutes"));
app.use("/api/report", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
