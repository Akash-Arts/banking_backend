const express = require("express");
const Transaction = require("../models/transaction");

const router = express.Router();

// GET USER TRANSACTIONS
router.get("/user/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch transactions",
    });
  }
});

module.exports = router;
