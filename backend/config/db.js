const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Vinal@013",
  database: "finance_app",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }

  console.log("MySQL Connected Successfully");
});

module.exports = db;