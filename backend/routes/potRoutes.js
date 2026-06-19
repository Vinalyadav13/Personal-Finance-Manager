const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addPot,
  getPots,
  updatePot,
  deletePot,
  addMoneyToPot,
} = require("../controllers/potController");

router.post("/", verifyToken, addPot);
router.get("/", verifyToken, getPots);
router.put("/:id", verifyToken, updatePot);
router.delete("/:id", verifyToken, deletePot);
router.put( "/add-money/:id", verifyToken, addMoneyToPot);

module.exports = router;