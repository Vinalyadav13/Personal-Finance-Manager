const express = require("express");
const router = express.Router();

const {
  sendTestEmail,
} = require("../services/emailServices");

router.get("/", async (req, res) => {
  try {

    await sendTestEmail(
      "vinalyadav013@gmail.com"
    );

    res.json({
      message:
        "Test email sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Email sending failed",
    });
  }
});

module.exports = router;