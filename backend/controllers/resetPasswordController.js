const db = require("../config/db");
const bcrypt = require("bcrypt");

const resetPassword = (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  if (!password) {

    return res.status(400).json({
      message: "Password is required",
    });

  }

  db.query(

    `
    SELECT *
    FROM users
    WHERE
      reset_token = ?
      AND reset_token_expiry > NOW()
    `,

    [token],

    async (err, results) => {

      if (err) {

        return res.status(500).json({
          message: "Database Error",
        });

      }

      if (results.length === 0) {

        return res.status(400).json({
          message: "Invalid or expired reset link.",
        });

      }

      const user = results[0];

      const hashedPassword =
        await bcrypt.hash(password, 10);

      db.query(

        `
        UPDATE users

        SET

        password = ?,

        reset_token = NULL,

        reset_token_expiry = NULL

        WHERE id = ?
        `,

        [hashedPassword, user.id],

        (err) => {

          if (err) {

            return res.status(500).json({
              message: "Database Error",
            });

          }

          res.json({

            message:
              "Password reset successfully.",

          });

        }

      );

    }

  );

};

module.exports = {
  resetPassword,
};