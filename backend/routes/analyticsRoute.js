const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getIncomeExpenseTrend,
} = require("../controllers/analyticsController");

router.get(
  "/income-expense-trend",
  verifyToken,
  getIncomeExpenseTrend
);

module.exports = router;