const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
},
});

const sendReminderEmail = async (
  to,
  billName,
  amount,
  dueDate
) => {
  await transporter.sendMail({
    from: "financeapp.reports@gmail.com",

    to,

    subject:
      "Recurring Bill Payment Reminder",

    html: `
      <h2>Payment Reminder</h2>

      <p>
        Your recurring bill
        <strong>${billName}</strong>
        is due soon.
      </p>

      <p>
        Amount:
        ₹${amount}
      </p>

      <p>
        Due Date:
        ${dueDate}
      </p>
    `,
  });
};

const sendReportEmail = async (
  to,
  name,
  pdfPath
) => {

  await transporter.sendMail({

    from: "financeapp.reports@gmail.com",

    to,

    subject: "Your FinTrack Pro Transaction Report",

    html: `
      <h2>Hello ${name},</h2>

      <p>
        Please find attached your latest
        <strong>FinTrack Pro Transaction Report</strong>.
      </p>

      <p>
        Thank you for using FinTrack Pro.
      </p>
    `,

    attachments: [

      {
        filename: "Transaction_Report.pdf",
        path: pdfPath,
      },

    ],

  });

};

const sendPasswordResetEmail = async (
  to,
  name,
  resetLink
) => {

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to,

    subject: "Reset Your FinTrack Pro Password",

    html: `
      <h2>Hello ${name},</h2>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to reset it:
      </p>

      <a
        href="${resetLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563EB;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Reset Password
      </a>

      <p style="margin-top:20px;">
        This link will expire in
        <strong>15 minutes</strong>.
      </p>

      <p>
        If you didn't request this,
        simply ignore this email.
      </p>
    `,

  });

};

module.exports = {
  sendReminderEmail,
  sendReportEmail,
  sendPasswordResetEmail,
};