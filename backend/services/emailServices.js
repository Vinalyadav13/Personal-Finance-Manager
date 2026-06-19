const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

const sendReminderEmail = async (
  to,
  billName,
  amount,
  dueDate
) => {
  await transporter.sendMail({
    from: "YOUR_EMAIL@gmail.com",

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

module.exports = {
  sendReminderEmail,
};