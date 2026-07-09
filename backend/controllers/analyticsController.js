const db = require("../config/db");

const getIncomeExpenseTrend = (req, res) => {

  const userId = req.user.id;

  const query = `
SELECT

DATE_FORMAT(created_at,'%Y-%m') AS month,

SUM(
CASE
WHEN type='income'
THEN amount
ELSE 0
END
) AS income,

SUM(
CASE
WHEN type='expense'
THEN amount
ELSE 0
END
) AS expense

FROM transactions

WHERE

user_id=?

AND created_at >= DATE_SUB(CURDATE(),INTERVAL 5 MONTH)

GROUP BY DATE_FORMAT(created_at,'%Y-%m')

ORDER BY month;
`;

  db.query(
    query,
    [userId],
    (err, results) => {

      if (err) {

        return res.status(500).json({
          message: "Database Error",
        });

      }

      const months = [];

const today = new Date();

for (let i = 5; i >= 0; i--) {

    const d = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
    );

    const key =
`${d.getFullYear()}-${String(
d.getMonth()+1
).padStart(2,"0")}`;

    const label =
        d.toLocaleString(
            "default",
            {
                month:"short",
            }
        );

    const found =
        results.find(
            item => item.month === key
        );

    months.push({

        month: label,

        income: found
            ? Number(found.income)
            : 0,

        expense: found
            ? Number(found.expense)
            : 0,

    });

}

res.json(months);

    }
  );

};

module.exports = {
  getIncomeExpenseTrend,
};