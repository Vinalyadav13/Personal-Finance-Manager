const db = require("../config/db");
const crypto = require("crypto");

const {
  sendPasswordResetEmail,
} = require("../services/emailServices");

const forgotPassword = (req, res) => {

  const { email } = req.body;

  if (!email) {

    return res.status(400).json({
      message: "Email is required",
    });

  }

  db.query(

    "SELECT * FROM users WHERE email = ?",

    [email],

    async (err, results) => {

      if (err) {

        return res.status(500).json({
          message: "Database Error",
        });

      }

      if (results.length === 0) {

        return res.status(404).json({
          message: "No account found with this email.",
        });

      }

      const user = results[0];

      // Generate secure token
      const token = crypto
        .randomBytes(32)
        .toString("hex");

      // Expires in 15 minutes
      const expiry = new Date(
        Date.now() + 15 * 60 * 1000
      );

      db.query(

        `
        UPDATE users
        SET reset_token = ?,
            reset_token_expiry = ?
        WHERE id = ?
        `,

        [token, expiry, user.id],

        async (err) => {

          if (err) {

            return res.status(500).json({
              message: "Database Error",
            });

          }

          const resetLink =
            `http://localhost:5173/reset-password/${token}`;

          await sendPasswordResetEmail(
            user.email,
            user.name,
            resetLink
          );

          res.json({

            message:
              "Password reset link sent successfully.",

          });

        }

      );

    }

  );

};

module.exports = {
  forgotPassword,
};