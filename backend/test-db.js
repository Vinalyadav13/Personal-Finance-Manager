require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

console.log("Testing connection with:");
console.log("Host:", process.env.AIVEN_DB_HOST);
console.log("User:", process.env.AIVEN_DB_USER);
console.log("Port:", process.env.AIVEN_DB_PORT);
console.log("DB:", process.env.AIVEN_DB_NAME);
console.log("Password length:", process.env.AIVEN_DB_PASSWORD ? process.env.AIVEN_DB_PASSWORD.length : 0);

const db = mysql.createConnection({
  host: process.env.AIVEN_DB_HOST,
  port: process.env.AIVEN_DB_PORT,
  user: process.env.AIVEN_DB_USER,
  password: process.env.AIVEN_DB_PASSWORD,
  database: process.env.AIVEN_DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "config/ca.pem")),
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connection successful!");
  process.exit(0);
});
