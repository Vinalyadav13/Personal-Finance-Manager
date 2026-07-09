const express = require("express");
const router = express.Router();

const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const {
  generateTransactionPDF,
} = require("../utils/pdfGenerator");

router.get("/", async (req, res) => {

const query = `
SELECT *
FROM transactions
WHERE user_id = 1
ORDER BY created_at DESC
`;

db.query(
  query,
  async (err, results) => {

      if (err) {
        console.log(err);

        return res
          .status(500)
          .json({
            message:
              "Database error",
          });
      }

      await generateTransactionPDF(
  results,
  "Transaction_Report.pdf"
);

      res.json({
        message:
          "PDF generated successfully",
      });

    }
  );

});

module.exports = router;