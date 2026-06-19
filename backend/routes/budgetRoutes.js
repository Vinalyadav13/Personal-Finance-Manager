const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.post("/", verifyToken, addBudget);
router.get("/", verifyToken, getBudgets);
router.put("/:id", verifyToken, updateBudget);
router.delete("/:id", verifyToken, deleteBudget);

module.exports = router;