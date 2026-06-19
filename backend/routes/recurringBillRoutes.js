const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addBill,
  getBills,
  updateBill,
  deleteBill,
  updateBillStatus,
} = require(
  "../controllers/recurringBillController"
);

router.post("/", verifyToken, addBill);

router.get("/", verifyToken, getBills);

router.put("/:id", verifyToken, updateBill);

router.put(
  "/status/:id",
  verifyToken,
  updateBillStatus
);

router.delete("/:id", verifyToken, deleteBill);

module.exports = router;