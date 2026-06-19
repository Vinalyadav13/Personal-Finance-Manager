const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getDashboardSummary,
  getRecentTransactions,
} = require("../controllers/transactionController");

router.post("/", verifyToken, addTransaction);
router.get("/summary", verifyToken, getDashboardSummary);
router.get( "/recent", verifyToken, getRecentTransactions);
router.get("/", verifyToken, getTransactions);
router.delete("/:id", verifyToken, deleteTransaction);
router.put("/:id", verifyToken, updateTransaction);

module.exports = router;