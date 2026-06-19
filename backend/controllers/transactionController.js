const db = require("../config/db");

const addTransaction = (req, res) => {
  const { title, amount, type } = req.body;

const user_id = req.user.id;

  const sql =
    "INSERT INTO transactions (user_id, title, amount, type) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [user_id, title, amount, type],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Transaction added successfully",
      });
    }
  );
};

const getTransactions = (req, res) => {
    console.log(req.user);
  const user_id = req.user.id;

const sql =
  "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC";

 db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json(results);
  });
};

const getRecentTransactions = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT *
    FROM transactions
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json(results);
  });
};

const deleteTransaction = (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM transactions WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  });
};

const updateTransaction = (req, res) => {
  const { id } = req.params;

  const { title, amount, type } = req.body;

  const sql = `
    UPDATE transactions
    SET title = ?, amount = ?, type = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, amount, type, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(200).json({
        message:
          "Transaction updated successfully",
      });
    }
  );
};

const getDashboardSummary = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses
    FROM transactions
    WHERE user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    const income =
      Number(results[0].totalIncome) || 0;

    const expenses =
      Number(results[0].totalExpenses) || 0;

    const balance =
      income - expenses;

    res.status(200).json({
      balance,
      income,
      expenses,
    });
  });
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary,
  getRecentTransactions,
};