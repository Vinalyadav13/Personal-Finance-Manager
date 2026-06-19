import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import CountUp from "react-countup";


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

const fetchSummary = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/transactions/summary",
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
      "http://localhost:5000/api/transactions/recent",
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
      "http://localhost:5000/api/recurring-bills",
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
      "http://localhost:5000/api/budgets",
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
      "http://localhost:5000/api/pots",
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

useEffect(() => {
  fetchSummary();
  fetchRecentTransactions();
  fetchUpcomingBills();
  fetchBudgets();
  fetchPots();
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



  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
            <Sidebar />

      {/* Main Content */}
      
        <div className="flex-1 ml-72 p-5 bg-gray-100 page-fade">
        <h1 className="text-3xl font-bold mb-5">Overview</h1>

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
      </div>
      </div>

  );
}

export default Dashboard;