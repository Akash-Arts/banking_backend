const express = require("express");
const Report = require("../models/reports");

const router = express.Router();


router.post("/create", async (req, res) => {
  try {
    const { userId, fromDate, toDate, subject, message } = req.body;

    if (!userId || !subject || !message) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const report = await Report.create({
      userId,
      fromDate,
      toDate,
      subject,
      message,
    });

    res.status(201).json({
      msg: "Report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to submit report",
      error: error.message,
    });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch reports",
      error: error.message,
    });
  }
});

module.exports = router;
