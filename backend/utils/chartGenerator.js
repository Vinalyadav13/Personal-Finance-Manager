const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const ChartDataLabels = require("chartjs-plugin-datalabels");
const fs = require("fs");

const width = 420;
const height = 420;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",

  chartCallback: (ChartJS) => {
    ChartJS.register(ChartDataLabels);
  },
});

const generatePieChart = async (
  income,
  expenses,
  filePath
) => {

  const configuration = {
    type: "pie",

    data: {
      labels: [
        "Income",
        "Expenses",
      ],

      datasets: [
        {
          data: [
            income,
            expenses,
          ],

          backgroundColor: [
            "#16A34A",
            "#DC2626",
          ],

          borderColor: "#FFFFFF",

          borderWidth: 2,
        },
      ],
    },

    options: {

  responsive: false,

  plugins: {

    legend: {
    display: false,
},

    title: {
  display: false,
},

    datalabels: {

      color: "white",

      font: {
        weight: "bold",
        size: 14,
      },

      formatter: (value, context) => {

        const total =
          context.dataset.data.reduce(
            (a, b) => a + b,
            0
          );

        const percentage =
          ((value / total) * 100).toFixed(1);

        return `${percentage}%`;

      },

    },

  },

},

  };

  const image =
    await chartJSNodeCanvas.renderToBuffer(
      configuration
    );

  fs.writeFileSync(
    filePath,
    image
  );
};

module.exports = {
  generatePieChart,
};