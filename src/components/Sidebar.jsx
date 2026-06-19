import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaWallet,
  FaFileInvoiceDollar,
} from "react-icons/fa";

function Sidebar() {
    const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
  className="
    fixed
    left-0
    top-0
    h-screen
    w-72
    bg-slate-900
    text-white
    p-6
    flex
    flex-col
  "
>
      <h1 className="text-5xl font-bold mb-12">finance</h1>

      <div className="space-y-3">
        <div
  onClick={() => navigate("/dashboard")}
  className={`flex items-center gap-3 p-4 rounded-xl font-semibold cursor-pointer transition
    ${
      location.pathname === "/dashboard"
        ? "bg-white text-slate-900"
        : "hover:bg-slate-800 text-white"
    }`}
>
          <FaHome />
          <span>Overview</span>
        </div>

       <div
  onClick={() => navigate("/transactions")}
  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition
    ${
      location.pathname === "/transactions"
        ? "bg-white text-slate-900"
        : "hover:bg-slate-800 text-white"
    }`}
>
          <FaExchangeAlt />
          <span>Transactions</span>
        </div>

<div
  onClick={() => navigate("/budgets")}
  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition
    ${
      location.pathname === "/budgets"
        ? "bg-white text-slate-900"
        : "hover:bg-slate-800 text-white"
    }`}
>
  <FaChartPie />
  <span>Budgets</span>
</div>
        <div
  onClick={() => navigate("/pots")}
  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition
    ${
      location.pathname === "/pots"
        ? "bg-white text-slate-900"
        : "hover:bg-slate-800 text-white"
    }`}
>
  <FaWallet />
  <span>Pots</span>
</div>

        <div
  onClick={() =>
    navigate("/recurring-bills")
  }
  className={`
    flex items-center gap-3 p-4 rounded-xl cursor-pointer
    ${
      location.pathname ===
      "/recurring-bills"
        ? "bg-white text-slate-900 font-semibold"
        : "hover:bg-slate-800"
    }`}
>
  <FaFileInvoiceDollar />
  <span>Recurring Bills</span>
</div>
</div>

      <div className="mt-auto text-gray-400">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;