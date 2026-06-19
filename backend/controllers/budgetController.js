const db = require("../config/db");

const addBudget = (req, res) => {
  const { category, amount } = req.body;

  const sql =
    "INSERT INTO budgets (user_id, category, amount) VALUES (?, ?, ?)";

  db.query(
    sql,
    [req.user.id, category, amount],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Budget added successfully",
      });
    }
  );
};



const getBudgets = (req, res) => {
  const sql =
    "SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC";

  db.query(
    sql,
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(results);
    }
  );
};

const updateBudget = (req, res) => {
  const { category, amount } = req.body;

  const sql = `
    UPDATE budgets
    SET category = ?, amount = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [category, amount, req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Budget updated successfully",
      });
    }
  );
};

const deleteBudget = (req, res) => {
  const sql =
    "DELETE FROM budgets WHERE id = ? AND user_id = ?";

  db.query(
    sql,
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Budget deleted successfully",
      });
    }
  );
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};