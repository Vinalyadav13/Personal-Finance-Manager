const PDFDocument = require("pdfkit");
const fs = require("fs");
const ChartDataLabels = require("chartjs-plugin-datalabels");
const path = require("path");
const {generatePieChart,} = require("./chartGenerator");

const generateTransactionPDF = async (
  transactions,
  filePath
) => {

const doc = new PDFDocument({
    margin: 50,
    bufferPages: true,
});

const stream = fs.createWriteStream(filePath);

doc.pipe(stream);

  const totalIncome = transactions
  .filter(
    (transaction) =>
      transaction.type === "income"
  )
  .reduce(
    (sum, transaction) =>
      sum + Number(transaction.amount),
    0
  );

const totalExpenses = transactions
  .filter(
    (transaction) =>
      transaction.type === "expense"
  )
  .reduce(
    (sum, transaction) =>
      sum + Number(transaction.amount),
    0
  );

const netSavings =
  totalIncome - totalExpenses;


  const chartPath = path.join(
  __dirname,
  "../assets/pie-chart.png"
);

await generatePieChart(
  totalIncome,
  totalExpenses,
  chartPath
);


  // Blue Header
doc
  .rect(0, 0, 612, 100)
  .fill("#0B1437");

  const logoPath = path.join(
  __dirname,
  "../assets/finance-logo.jpeg"
);

doc.image(
  logoPath,
  25,
  18,
  {
    width: 60,
  }
);

// App Title
doc
  .fillColor("white")
  .fontSize(28)
  .text(
    "FinTrack Pro",
    110,
    25,
    {
      align: "center",
    }
  );

// Report Title
doc
  .fontSize(16)
  .text(
  "Transaction Report",
  110,
  60,
    {
      align: "center",
    }
  );

doc.y = 120;

doc.fillColor("#0B1437");

doc
  .fillColor("#1E3A8A")
  .font("Helvetica-Bold")
  .fontSize(13)
  .text(
    "FINANCIAL SUMMARY",
    50,
    128
  );

  doc
  .moveTo(50, 145)
  .lineTo(110, 145)
  .strokeColor("#1E3A8A")
  .lineWidth(2)
  .stroke();


doc.y = 160;

doc.moveDown(0.5);

const cardY = doc.y;

// Income Card
doc
  .roundedRect(50, cardY, 85, 58, 8)
  .fillAndStroke("#E8F8EC", "#16A34A");

doc
  .fillColor("#166534")
  .fontSize(8)
  .text("TOTAL INCOME", 58, cardY + 10);

doc
  .fontSize(12)
  .text(
    `Rs. ${totalIncome.toLocaleString("en-IN")}`,
    58,
    cardY + 28
)

// Expense Card
doc
  .roundedRect(175, cardY, 85, 58, 8)
  .fillAndStroke("#FDECEC", "#DC2626");

doc
  .fillColor("#991B1B")
  .fontSize(8)
  .text("TOTAL EXPENSES", 185, cardY + 10);

doc
  .fontSize(12)
  .text(
    `Rs. ${totalExpenses.toLocaleString("en-IN")}`,
    185,
    cardY + 28
  );

// Savings Card
doc
  .roundedRect(300, cardY,85, 58, 8)
  .fillAndStroke("#EEF4FF", "#2563EB");

doc
  .fillColor("#1D4ED8")
  .fontSize(8)
  .text("NET SAVINGS", 310, cardY + 10);

doc
  .fontSize(12)
  .text(
    `Rs. ${netSavings.toLocaleString("en-IN")}`,
    310,
    cardY + 28
  );

doc.fillColor("black");

doc
  .fillColor("#1E3A8A")
  .font("Helvetica-Bold")
  .fontSize(11)
  .text(
    "Generated On:",
    240,
    108
  );

doc
  .font("Helvetica")
  .fillColor("black")
  .text(
    new Date().toLocaleDateString("en-GB"),
    330,
    108
  );

  doc
  .fillColor("#1E3A8A")
  .font("Helvetica-Bold")
  .fontSize(13)
  .text(
    "INCOME vs EXPENSES",
    400,
    128
  );

doc
  .moveTo(400,145)
  .lineTo(470,145)
  .strokeColor("#1E3A8A")
  .lineWidth(2)
  .stroke();

doc.fillColor("black");

// Pie Chart
doc.image(
  chartPath,
  430,
  155,
  {
    width: 125,
  }
);

doc
.rect(430,285,8,8)
.fill("#16A34A");

doc
.fillColor("black")
.fontSize(10)
.text(
    `Income (Rs. ${totalIncome.toLocaleString("en-IN")})`,
    445,
    281
);

doc
.rect(430,303,8,8)
.fill("#DC2626");

doc
.fillColor("black")
.fontSize(10)
.text(
    `Expenses (Rs. ${totalExpenses.toLocaleString("en-IN")})`,
    445,
    299
);

doc.moveDown(6);


doc.y = cardY + 90;

doc
  .fillColor("#1E3A8A")
  .font("Helvetica-Bold")
  .fontSize(15)
  .text(
    "TRANSACTIONS",
    50,
    345
  );

doc
  .fillColor("black")
  .font("Helvetica");

doc.moveDown(0.2);

// Table Starting Position
let tableTop = 375;

drawTableHeader(tableTop);

function drawTableHeader(y) {

  // Header Background
  doc
    .rect(50, y, 500, 28)
    .fill("#0B1437");

  // Header Text
  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(11);

  doc.text("Date",70,y+8);
  doc.text("Title",160,y+8);
  doc.text("Type",340,y+8);
  doc.text("Amount",455,y+8);

  doc
    .fillColor("black")
    .font("Helvetica");
}


let rowY = tableTop + 30;

let pageNumber = 1;

const firstPageLimit = 720;
const otherPageLimit = 760;
const newPageTableTop = 50;


transactions.forEach((transaction,index)=>{

    const pageLimit =
  pageNumber === 1
    ? firstPageLimit
    : otherPageLimit;

if (rowY > pageLimit) {

    doc.addPage();

    pageNumber++;

    tableTop = newPageTableTop;

    drawTableHeader(tableTop);

    rowY = tableTop + 30;
}

    // Alternate Row Color
    if (index % 2 === 0) {
      doc
        .rect(
          50,
          rowY - 2,
          500,
          25
        )
        .fill("#F8FAFC");

      doc.fillColor("black");
    }

    const date =
      new Date(
        transaction.created_at
      ).toLocaleDateString(
        "en-GB"
      );

    doc.text(
      date,
      65,
      rowY
    );

doc.text(
  transaction.title.charAt(0).toUpperCase() +
  transaction.title.slice(1),
  160,
  rowY
);

    // Type Badge
    if (
      transaction.type ===
      "income"
    ) {

      doc
        .fillColor("green")
        .text(
          "Income",
          340,
          rowY
        );

    } else {

      doc
        .fillColor("red")
        .text(
          "Expense",
          340,
          rowY
        );

    }

    // Amount Color
    if (
      transaction.type ===
      "income"
    ) {

      doc.fillColor("green");

    } else {

      doc.fillColor("red");

    }

doc.text(
  `Rs. ${Number(
    transaction.amount
  ).toLocaleString("en-IN")}`,
  430,
  rowY,
  {
    width: 90,
    align: "right",
  }
);

    doc.fillColor("black");

    rowY += 25;


  }
);

// doc.x = 50;
// doc.y = 700;

// // ================= FOOTER =================

// const footerY = 690;

// // Top Border
// doc
//   .moveTo(40, footerY - 12)
//   .lineTo(570, footerY - 12)
//   .strokeColor("#D1D5DB")
//   .lineWidth(1)
//   .stroke();

// // App Name
// doc
//   .font("Helvetica-Bold")
//   .fontSize(11)
//   .fillColor("#1E3A8A")
//   doc.text(
//   "Thank you for using FinTrack Pro!",
//   75,
//   footerY
// );

// // Footer Description
// doc
//   .font("Helvetica")
//   .fontSize(9)
//   .fillColor("#6B7280")
//   doc.text(
//   "Keep tracking your finances and achieve your financial goals.",
//   75,
//   footerY + 16
// );

// ================= PAGE NUMBERS =================

const range = doc.bufferedPageRange();

for (let i = 0; i < range.count; i++) {

  // Switch to the page first
  doc.switchToPage(i);

  const pageText = `Page ${i + 1} of ${range.count}`;

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280");

  const textWidth = doc.widthOfString(pageText);

  const pageWidth = doc.page.width;

doc.text(
  pageText,
  (pageWidth - textWidth) / 2,
  780,
  {
    lineBreak: false,
  }
);
}

doc.end();

await new Promise((resolve, reject) => {

    stream.on("finish", resolve);

    stream.on("error", reject);

});

if (fs.existsSync(chartPath)) {

    fs.unlinkSync(chartPath);

}
};

module.exports = {
  generateTransactionPDF,
};