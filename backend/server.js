require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const potRoutes = require("./routes/potRoutes");
const recurringBillRoutes = require("./routes/recurringBillRoutes");
const testEmailRoute = require("./routes/testEmailRoute");
const pdfTestRoute =  require("./routes/pdfTestRoute");
const emailReportRoute = require("./routes/emailReportRoute");
const downloadReportRoute = require("./routes/downloadReportRoute");
const analyticsRoute = require("./routes/analyticsRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const resetPasswordRoute = require("./routes/resetPasswordRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/pots", potRoutes);
app.use("/api/recurring-bills",recurringBillRoutes);
app.use("/api/test-email", testEmailRoute);
app.use("/api/email-report", emailReportRoute);
app.use("/api/download-report",downloadReportRoute);
app.use("/api/analytics", analyticsRoute);
app.use( "/api/pdf-test", pdfTestRoute);
app.use("/api",forgotPasswordRoute);
app.use("/api",resetPasswordRoute);

// Serve static frontend files from Vite build
const frontendPath = path.join(__dirname, "../dist");
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});