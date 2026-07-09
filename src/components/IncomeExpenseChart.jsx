import {
  Line,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function IncomeExpenseChart({ data }) {

  const chartData = {

    labels: data.map(
      item => item.month
    ),

    datasets: [

      {
        label: "Income",

        data: data.map(
          item => Number(item.income)
        ),

        borderColor: "#16A34A",

        backgroundColor: "#16A34A",

        tension: 0.4,
      },

      {
        label: "Expense",

        data: data.map(
          item => Number(item.expense)
        ),

        borderColor: "#DC2626",

        backgroundColor: "#DC2626",

        tension: 0.4,
      },

    ],

  };

  const options = {

    responsive: true,

    plugins: {

      legend: {
        position: "top",
      },

    },

  };

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-4">

        Income vs Expense Trend

      </h2>

      <Line
        data={chartData}
        options={options}
      />

    </div>

  );

}

export default IncomeExpenseChart;