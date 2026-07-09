const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  downloadReport,
} = require("../controllers/downloadReportController");

router.get(
  "/",
  verifyToken,
  downloadReport
);

module.exports = router;