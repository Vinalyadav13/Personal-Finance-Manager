const db = require("../config/db");

const addPot = (req, res) => {
  const { pot_name, target_amount } = req.body;

  const sql = `
    INSERT INTO pots
    (user_id, pot_name, target_amount)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [req.user.id, pot_name, target_amount],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Pot created successfully",
      });
    }
  );
};

const getPots = (req, res) => {
  const sql = `
    SELECT *
    FROM pots
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

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

const updatePot = (req, res) => {
  const { pot_name, target_amount, saved_amount } = req.body;

  const sql = `
    UPDATE pots
    SET
      pot_name = ?,
      target_amount = ?,
      saved_amount = ?
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(
    sql,
    [
      pot_name,
      target_amount,
      saved_amount,
      req.params.id,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Pot updated successfully",
      });
    }
  );
};

const deletePot = (req, res) => {
  const sql =
    "DELETE FROM pots WHERE id = ? AND user_id = ?";

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
        message: "Pot deleted successfully",
      });
    }
  );
};

const addMoneyToPot = (req, res) => {
  const { amount } = req.body;

  const sql = `
    UPDATE pots
    SET saved_amount = saved_amount + ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      amount,
      req.params.id,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message:
          "Money added successfully",
      });
    }
  );
};

module.exports = {
  addPot,
  getPots,
  updatePot,
  deletePot,
  addMoneyToPot,
};