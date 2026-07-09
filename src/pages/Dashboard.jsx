import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { toast } from "react-toastify";


function Dashboard() {
    const [summary, setSummary] = useState({
  balance: 0,
  income: 0,
  expenses: 0,
});
const [recentTransactions, setRecentTransactions] =
  useState([]);

  const [upcomingBills, setUpcomingBills] =
  useState([]);
  const [budgets, setBudgets] =
  useState([]);
  const [pots, setPots] =
  useState([]);
  const [trendData, setTrendData] = useState([]);
  const [showReportModal, setShowReportModal] =
  useState(false);

const [reportAction, setReportAction] =
  useState("");

const [reportFilter, setReportFilter] =
  useState("all");
  const [sendingEmail, setSendingEmail] = useState(false);

const fetchSummary = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "/api/transactions/summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    

    setSummary(response.data);
  } catch (error) {
    console.log(error);
  }
};

const fetchRecentTransactions = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "/api/transactions/recent",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    setRecentTransactions(
  response.data.slice(0, 4)
);

  } catch (error) {
    console.log(error);
  }
};
const fetchUpcomingBills = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "/api/recurring-bills",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const today = new Date();

    const upcoming = response.data
      .filter((bill) => {
        const dueDate = new Date(
          bill.due_date
        );

        const diff =
          (dueDate - today) /
          (1000 * 60 * 60 * 24);

        return (
          bill.status === "unpaid" &&
          diff >= 0
        );
      })
      .sort(
        (a, b) =>
          new Date(a.due_date) -
          new Date(b.due_date)
      )
      .slice(0, 4);

    setUpcomingBills(upcoming);

  } catch (error) {
    console.log(error);
  }
};

const fetchBudgets = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      "/api/budgets",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setBudgets(response.data);

  } catch (error) {
    console.log(error);
  }
};

const fetchPots = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      "/api/pots",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    setPots(response.data);

  } catch (error) {
    console.log(error);
  }
};

const fetchIncomeExpenseTrend = async () => {

  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "/api/analytics/income-expense-trend",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTrendData(response.data);

  } catch (error) {

    console.log(error);

  }

};

useEffect(() => {
  fetchSummary();
  fetchRecentTransactions();
  fetchUpcomingBills();
  fetchBudgets();
  fetchPots();
  fetchIncomeExpenseTrend();
}, []);

const getDaysLeft = (dueDate) => {
  const today = new Date();

  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (due - today) /
    (1000 * 60 * 60 * 24)
  );

  return diff;
};

const totalSaved = pots.reduce(
  (sum, pot) =>
    sum + Number(pot.saved_amount || 0),
  0
);

const downloadReport = async (filter) => {

  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `/api/download-report?filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "Transaction_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    toast.error("Unable to download report.");

  }

};

const emailReport = async (filter) => {

  try {

    setSendingEmail(true);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `/api/email-report?filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);

  } catch (error) {

    toast.error(
  error.response?.data?.message ||
  "Unable to send email."
);

  } finally {

    setSendingEmail(false);

  }

};

const handleGenerateReport = () => {

  setShowReportModal(false);

  if (reportAction === "download") {

    downloadReport(reportFilter);

  } else {

    emailReport(reportFilter);

  }

};

  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
            <Sidebar />

      {/* Main Content */}
      
        <div className="flex-1 ml-72 p-5 bg-gray-100 page-fade">
        <div className="flex justify-between items-center mb-5">

  <h1 className="text-3xl font-bold">
    Overview
  </h1>

  <div className="flex gap-3">

    <button
  onClick={() => {
  setReportAction("download");
  setShowReportModal(true);
}}
  className="
    bg-blue-600
    hover:bg-blue-700
    text-white
    px-5
    py-2
    rounded-lg
    font-medium
    transition
  "
>
  📄 Download Report
</button>

    <button
  onClick={() => {
  setReportAction("email");
  setShowReportModal(true);
}}
  disabled={sendingEmail}
  className="
    bg-green-600
    hover:bg-green-700
    disabled:bg-gray-400
    text-white
    px-5
    py-2
    rounded-lg
    font-medium
    transition
  "
>
  {sendingEmail
    ? "Sending..."
    : "📧 Email My Report"}
</button>

  </div>

</div>

        <div className="grid grid-cols-3 gap-6">
          <div
  className="
    bg-slate-900
    text-white
    p-6
    rounded-xl
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
            <h3>Current Balance</h3>
            <p className="text-3xl font-bold mt-2">
                ₹{summary.balance.toLocaleString()}
            </p>
          </div>

          <div
  className="
    bg-white
    p-6
    rounded-xl
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
            <h3>Income</h3>
            <p className="text-3xl font-bold mt-2">
                ₹{summary.income.toLocaleString()}
            </p>
          </div>

          <div
  className="
    bg-white
    p-6
    rounded-xl
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
            <h3>Expenses</h3>
            <p className="text-3xl font-bold mt-2">
                ₹{summary.expenses.toLocaleString()}
            </p>
          </div>
          </div>

          <div className="mt-6">
  <IncomeExpenseChart data={trendData} />
</div>

          <div className="grid grid-cols-2 gap-6 mt-4">

  {/* Recent Transactions */}

  <div
  className="
    bg-white
    rounded-xl
    p-6
    shadow
    h-full
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "

>

    <div className="flex justify-between items-center mb-4">

  <h2 className="text-2xl font-bold">
    Recent Transactions
  </h2>

  <Link
    to="/transactions"
    className="
      text-gray-500
      hover:text-black
      font-medium
      flex
      items-center
      gap-1
      transition
    "
  >
    View All →
  </Link>

</div>

    <div className="grid grid-cols-2 gap-5 mt-4">

      {recentTransactions.map(
  (transaction, index) => (

        <div
  key={transaction.id}
 className="
  flex
  justify-between
  items-center
  bg-gray-50
  rounded-xl
  px-4
  py-3
"
  style={{
  borderLeft: `5px solid ${
    [
      "#7F6C8D",
      "#2D9C95",
      "#82D3E0",
      "#F0D0A7",
    ][index % 4]
  }`,
}}
>

          <div>

            <p className="font-medium">
  {transaction.title
    .split(" ")
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ")}
</p>

<p className="text-sm text-gray-500">
  {new Date(
    transaction.created_at
  ).toLocaleDateString("en-GB")}
</p>

            

          </div>

          <span
            className={
              transaction.type === "income"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {transaction.type === "income"
              ? "+"
              : "-"}
            ₹{Number(transaction.amount).toLocaleString()}
          </span>

        </div>

      ))}

    </div>

  </div>






  {/* Upcoming Bills */}

  <div
  className="
    bg-white
    rounded-xl
    p-6
    shadow
    h-full
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>

    <div className="flex justify-between items-center mb-4">

  <h2 className="text-2xl font-bold">
    Upcoming Bills
  </h2>

  <Link
    to="/recurring-bills"
    className="
      text-gray-500
      hover:text-black
      font-medium
      flex
      items-center
      gap-1
      transition
    "
  >
    View All →
  </Link>

</div>

    {upcomingBills.length === 0 ? (

      <p className="text-gray-500">
        No upcoming bills 🎉
      </p>

    ) : (

      <div className="grid grid-cols-2 gap-5 mt-4">

        {upcomingBills.map(
  (bill, index) => (

          <div
  key={bill.id}
  className="
    flex
    justify-between
    items-center
    bg-gray-50
    rounded-xl
    px-4
    py-3
  "
  style={{
  borderLeft: `5px solid ${
    [
      "#7F6C8D",
      "#2D9C95",
      "#82D3E0",
      "#F0D0A7",
    ][index % 4]
  }`,
}}
>

            <div>

              <p className="font-medium">
                {bill.bill_name.charAt(0).toUpperCase() +
                  bill.bill_name.slice(1)}
              </p>

              <p className="text-sm text-gray-500">

  Due on{" "}
  {new Date(
    bill.due_date
  ).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
    }
  )}

  {" ("}

  {getDaysLeft(
    bill.due_date
  )}

  {getDaysLeft(
    bill.due_date
  ) === 1
    ? " day"
    : " days"}

  {")"}

</p>

            </div>

            <span className="font-semibold text-red-500">
              ₹{Number(
                bill.amount
              ).toLocaleString()}
            </span>

          </div>

        ))}

      </div>

    )}

  </div>
  </div>

{/* Pots card */}

  <div className="grid grid-cols-2 gap-6 mt-4">

    <div
  className="
    bg-white
    rounded-xl
    p-6
    shadow
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>

  <div className="flex justify-between items-center mb-4">

  <div>

    <h2 className="text-2xl font-bold">
      Pots
    </h2>

    <p className="text-gray-500 text-sm mt-1">
      Total Saved:
      <span className="font-semibold text-black ml-2">
        ₹{totalSaved.toLocaleString()}
      </span>
    </p>

  </div>

  <Link
    to="/pots"
    className="text-gray-500 hover:text-black"
  >
    View All →
  </Link>

</div>

  <div>

  {/* Pots List */}

  <div className="flex-1">

    <div className="grid grid-cols-2 gap-3 mt-4">

  {pots
    .filter(
      (pot) =>
        Number(pot.saved_amount) > 0
    )
    .slice(0, 4)
    .map((pot, index) => (

      <div
        key={pot.id}
        className="
  flex
  justify-between
  items-center
  bg-gray-50
  rounded-xl
  p-3
  hover:shadow-md
  transition
"
        style={{
          borderLeft: `5px solid ${
            [
              "#7F6C8D",
              "#2D9C95",
              "#82D3E0",
              "#F0D0A7",
            ][index % 4]
          }`,
        }}
      >

        <span className="font-medium">
          {pot.pot_name
  .split(" ")
  .map(
    word =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
  )
  .join(" ")}
        </span>

        <span className="font-bold">
          ₹
          {Number(
            pot.saved_amount
          ).toLocaleString()}
        </span>

      </div>

  ))}



    </div>

  </div>

</div>

</div>

       {/* Budgets card */}

        <div
  className="
    bg-white
    rounded-xl
    p-6
    shadow
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>

  <div className="flex justify-between items-center mb-3">

    <h2 className="text-2xl font-bold">
      Budgets
    </h2>

    <Link
      to="/budgets"
      className="
        text-gray-500
        hover:text-black
      "
    >
      View All →
    </Link>

  </div>

  <p className="text-sm text-gray-500 mb-3">
  {budgets.length} Categories
</p>
<div className="grid grid-cols-2 gap-3">

  {budgets.slice(0, 4).map(
    (budget, index) => (

      <div
        key={budget.id}
        
  className="
    flex
    justify-between
    items-center
    bg-gray-50
    rounded-xl
    px-4
    py-3
    w-full
  "

        style={{
          borderLeft: `5px solid ${
            [
              "#2D9C95",
              "#7F6C8D",
              "#82D3E0",
              "#F0D0A7",
            ][index % 4]
          }`,
        }}
      >

        <p className="font-medium">
  {budget.category
  .split(" ")
  .map(
    (word) =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
  )
  .join(" ")
}
</p>

<p className="font-bold whitespace-nowrap">
  ₹
  {Number(
    budget.amount || budget.maximum
  ).toLocaleString()}
</p>

      </div>

  ))}

</div>




 </div>
</div>

{
showReportModal && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

<div className="bg-white rounded-xl p-8 w-[420px]">

<h2 className="text-2xl font-bold mb-5">
Generate Report
</h2>

<p className="font-medium mb-3">
Report Duration
</p>

<div className="space-y-3">

<label className="flex gap-3">

<input
type="radio"
name="report"
value="all"
checked={reportFilter==="all"}
onChange={(e)=>setReportFilter(e.target.value)}
/>

All Transactions

</label>

<label className="flex gap-3">

<input
type="radio"
name="report"
value="7days"
checked={reportFilter==="7days"}
onChange={(e)=>setReportFilter(e.target.value)}
/>

Last 7 Days

</label>

<label className="flex gap-3">

<input
type="radio"
name="report"
value="30days"
checked={reportFilter==="30days"}
onChange={(e)=>setReportFilter(e.target.value)}
/>

Last 30 Days

</label>

<label className="flex gap-3">

<input
type="radio"
name="report"
value="thisMonth"
checked={reportFilter==="thisMonth"}
onChange={(e)=>setReportFilter(e.target.value)}
/>

This Month

</label>

<label className="flex gap-3">

<input
type="radio"
name="report"
value="lastMonth"
checked={reportFilter==="lastMonth"}
onChange={(e)=>setReportFilter(e.target.value)}
/>

Last Month

</label>

</div>

<div className="flex justify-end gap-3 mt-8">

<button
onClick={()=>{
setShowReportModal(false);
}}
className="px-5 py-2 border rounded-lg"
>

Cancel

</button>

<button
onClick={handleGenerateReport}
className="bg-blue-600 text-white px-5 py-2 rounded-lg"
>

Generate

</button>

</div>

</div>

</div>

)
}

      </div>
      </div>

  );
}

export default Dashboard;