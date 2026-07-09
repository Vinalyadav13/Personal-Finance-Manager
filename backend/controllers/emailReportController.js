const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const {
  generateTransactionPDF,
} = require("../utils/pdfGenerator");

const {
  sendReportEmail,
} = require("../services/emailServices");

const emailReport = async (req, res) => {

  try {

    const userId = req.user.id;
    const filter = req.query.filter || "all";
    console.log("Logged in user:", userId);

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

    // Get user email
    db.query(
      "SELECT email, name FROM users WHERE id = ?",
      [userId],
      async (err, userResult) => {

        if (err) {
          return res.status(500).json({
            message: "Database Error",
          });
        }

        if (userResult.length === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        const user = userResult[0];

        // Get Transactions
        db.query(
  query,
  [userId],

          async (err, transactions) => {
            

            if (err) {
              return res.status(500).json({
                message: "Database Error",
              });
            }

            console.log("Transactions fetched:", transactions.length);

transactions.forEach((t) => {
  console.log(
    t.user_id,
    t.title,
    t.amount
  );
});

            const pdfPath = path.join(
    __dirname,
    `../Transaction_Report_${userId}.pdf`
);

            await generateTransactionPDF(
  transactions,
  pdfPath
);

await sendReportEmail(
  user.email,
  user.name,
  pdfPath
);

// Delete PDF after sending

if (fs.existsSync(pdfPath)) {

  fs.unlinkSync(pdfPath);

}

res.json({

  message:
    "Report emailed successfully.",

});

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
  emailReport,
};