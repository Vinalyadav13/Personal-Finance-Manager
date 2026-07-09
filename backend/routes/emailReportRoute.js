const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  emailReport,
} = require("../controllers/emailReportController");

router.get(
  "/",
  verifyToken,
  emailReport
);

module.exports = router;