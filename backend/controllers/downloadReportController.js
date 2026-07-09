const db = require("../config/db");
const path = require("path");
const fs = require("fs");

const {
  generateTransactionPDF,
} = require("../utils/pdfGenerator");

const downloadReport = async (req, res) => {

  try {

    const userId = req.user.id;
    const filter = req.query.filter || "all";

    let query = `
SELECT *
FROM transactions
WHERE user_id = ?
`;

if (filter === "7days") {

  query += `
  AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  `;

}

else if (filter === "30days") {

  query += `
  AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  `;

}

else if (filter === "thisMonth") {

  query += `
  AND MONTH(created_at)=MONTH(CURDATE())
  AND YEAR(created_at)=YEAR(CURDATE())
  `;

}

else if (filter === "lastMonth") {

  query += `
  AND MONTH(created_at)=MONTH(CURDATE())-1
  AND YEAR(created_at)=YEAR(CURDATE())
  `;

}

query += `
ORDER BY created_at DESC
`;

    db.query(
  query,
  [userId],

      async (err, transactions) => {

        if (err) {

          return res.status(500).json({
            message: "Database Error",
          });

        }

        const pdfPath = path.join(
          __dirname,
          `../Transaction_Report_${userId}.pdf`
        );

        await generateTransactionPDF(
          transactions,
          pdfPath
        );

        res.download(
          pdfPath,
          "Transaction_Report.pdf",
          (err) => {

            if (fs.existsSync(pdfPath)) {

              fs.unlinkSync(pdfPath);

            }

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  downloadReport,
};