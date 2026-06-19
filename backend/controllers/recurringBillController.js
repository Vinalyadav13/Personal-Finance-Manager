const db = require("../config/db");

const addBill = (req, res) => {
  const { bill_name, amount, due_date } = req.body;

  const sql = `
    INSERT INTO recurring_bills
    (user_id, bill_name, amount, due_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [req.user.id, bill_name, amount, due_date],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Bill added successfully",
      });
    }
  );
};

const getBills = (req, res) => {
  const sql = `
    SELECT *
    FROM recurring_bills
    WHERE user_id = ?
    ORDER BY due_date ASC
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

const updateBill = (req, res) => {
  const {
    bill_name,
    amount,
    due_date,
    status,
  } = req.body;

  const sql = `
    UPDATE recurring_bills
    SET bill_name = ?,
        amount = ?,
        due_date = ?,
        status = ?
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(
    sql,
    [
      bill_name,
      amount,
      due_date,
      status,
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
        message: "Bill updated successfully",
      });
    }
  );
};

const deleteBill = (req, res) => {
  const sql = `
    DELETE FROM recurring_bills
    WHERE id = ?
    AND user_id = ?
  `;

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
        message: "Bill deleted successfully",
      });
    }
  );
};

const updateBillStatus = (
  req,
  res
) => {
  const { status } = req.body;

  const sql = `
    UPDATE recurring_bills
    SET status = ?
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(
    sql,
    [
      status,
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
          "Status updated successfully",
      });
    }
  );
};

module.exports = {
  addBill,
  getBills,
  updateBill,
  deleteBill,
  updateBillStatus,
};

exports.markBillPaid = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE recurring_bills
      SET status='paid'
      WHERE id=?
      `,
      [id]
    );

    res.json({
      message:
        "Bill marked as paid",
    });
  } catch (error) {
    console.log(error);
  }
};