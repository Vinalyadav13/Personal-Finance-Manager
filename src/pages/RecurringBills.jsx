import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

function RecurringBills() {
  const [bills, setBills] = useState([]);
  const [statusFilter, setStatusFilter] =
  useState("all");
  const [sortBy, setSortBy] =
  useState("dueAsc");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
const [billName, setBillName] = useState("");
const [amount, setAmount] = useState("");
const [dueDate, setDueDate] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);
const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [deleteId, setDeleteId] =
  useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
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

      setBills(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalBills = bills.reduce(
  (sum, bill) => sum + Number(bill.amount),
  0
);

const paidBills = bills
  .filter((bill) => bill.status === "paid")
  .reduce(
    (sum, bill) =>
      sum + Number(bill.amount),
    0
  );

const unpaidBills = bills
  .filter((bill) => bill.status === "unpaid")
  .reduce(
    (sum, bill) =>
      sum + Number(bill.amount),
    0
  );

  const getBillStatus = (dueDate) => {
  const today = new Date();

  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const difference =
    (due - today) / (1000 * 60 * 60 * 24);

  if (difference < 0) {
    return "overdue";
  }

  if (difference <= 2) {
    return "dueSoon";
  }

  return "upcoming";
};

  const overdueBills = bills
  .filter(
    (bill) =>
      bill.status === "unpaid" &&
      getBillStatus(
        bill.due_date
      ) === "overdue"
  )
  .reduce(
    (sum, bill) =>
      sum + Number(bill.amount),
    0
  );

  
  const handleAddBill = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/recurring-bills",
      {
        bill_name: billName,
        amount,
        due_date: dueDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBills();

    setShowModal(false);

    setBillName("");
    setAmount("");
    setDueDate("");

  } catch (error) {
    console.log(error);
  }
};

const handleEdit = (bill) => {
  setIsEditing(true);

  setEditId(bill.id);

  setBillName(bill.bill_name);

  setAmount(bill.amount);

  const date = new Date(
  bill.due_date
);

const year = date.getFullYear();

const month = String(
  date.getMonth() + 1
).padStart(2, "0");

const day = String(
  date.getDate()
).padStart(2, "0");

setDueDate(
  `${year}-${month}-${day}`
);

  setShowModal(true);
};

const handleUpdateBill = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/recurring-bills/${editId}`,
      {
        bill_name: billName,
        amount,
        due_date: dueDate,
        status: "unpaid",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBills();

    setShowModal(false);

    setIsEditing(false);

    setEditId(null);

    setBillName("");
    setAmount("");
    setDueDate("");

  } catch (error) {
    console.log(error);
  }
};

const openDeleteModal = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/recurring-bills/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBills();

  } catch (error) {
    console.log(error);
  }
};

const handleStatusChange = async (
  id,
  status
) => {
  try {
    const token =
      localStorage.getItem("token");

    await axios.put(
  `http://localhost:5000/api/recurring-bills/status/${id}`,
      {
        status,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    fetchBills();

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-72 p-8 bg-gray-100 page-fade">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Recurring Bills
          </h1>

          <button
  onClick={() => setShowModal(true)}
  className="
    bg-[#0B1437]
    text-white
    px-5
    py-3
    rounded-xl
    hover:opacity-90
  "
>
  + New Bill
</button>
        </div>
           <div className="flex justify-between items-center mb-6">

  <input
    type="text"
    placeholder="🔍 Search bills..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
  w-[350px]
  border
  p-3
  rounded-xl
  bg-white
  hover:border-slate-500
  focus:outline-none
  focus:ring-2
  focus:ring-slate-300
"
  />

  <div className="flex gap-4">

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="
      border
      p-3
      rounded-xl
      bg-white
      w-[180px]
    "
  >
    <option value="all">
      All Bills
    </option>

    <option value="paid">
      Paid Bills
    </option>

    <option value="unpaid">
      Unpaid Bills
    </option>
  </select>

  <select
    value={sortBy}
    onChange={(e) =>
      setSortBy(e.target.value)
    }
    className="
      border
      p-3
      rounded-xl
      bg-white
      w-[220px]
    "
  >
    <option value="dueAsc">
      Due Date ↑
    </option>

    <option value="dueDesc">
      Due Date ↓
    </option>

    <option value="amountHigh">
      Amount High → Low
    </option>

    <option value="amountLow">
      Amount Low → High
    </option>
  </select>

</div>

</div>

<div className="grid grid-cols-3 gap-6 mb-8 w-full">
  <div
  className="
    bg-white
    rounded-xl
    shadow
    p-5
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
    <p className="text-gray-500 mb-2">
      Total Bills
    </p>
    <p className="text-sm text-gray-500 mt-2">
  {bills.length} Bills
</p>

    <h2 className="text-3xl font-bold mt-3">
      ₹{totalBills.toLocaleString()}
    </h2>
  </div>

  <div
  className="
    bg-white
    rounded-xl
    shadow
    p-5
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
    <p className="text-gray-500 mb-2">
      Paid Bills
    </p>

    <h2 className="text-3xl font-bold text-green-600 group-hover:scale-105 transition">
      ₹{paidBills.toLocaleString()}
    </h2>
  </div>

  <div
  className="
    bg-white
    rounded-xl
    shadow
    p-5
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
    <p className="text-gray-500 mb-2">
      Unpaid Bills
    </p>

    <h2 className="text-3xl font-bold text-red-500 group-hover:scale-105 transition">
      ₹{unpaidBills.toLocaleString()}
    </h2>
  </div>

</div>


        <div className="bg-white rounded-xl shadow p-8">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left p-4">
                  Bill Name
                </th>

                <th className="text-left p-4">
                  Amount
                </th>

                <th className="text-left p-4">
                  Due Date
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

 {bills
  .filter((bill) =>
    bill.bill_name
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter((bill) => {
    if (statusFilter === "all") {
      return true;
    }

    return bill.status === statusFilter;
  }).length === 0 ? (

    <tr>
      <td
        colSpan="5"
        className="
          text-center
          py-12
          text-gray-500
        "
      >
        <div>
          <p className="text-4xl mb-2">
            📄
          </p>

          <p className="text-lg font-medium">
            No recurring bills found
          </p>

          <p className="text-sm mt-1">
            Add your first recurring bill to start tracking payments
          </p>
        </div>
      </td>
    </tr>

  ) : (

    bills
  .filter((bill) =>
    bill.bill_name
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter((bill) => {
    if (statusFilter === "all") {
      return true;
    }

    return bill.status === statusFilter;
  })
  .sort((a, b) => {

    if (sortBy === "dueAsc") {
      return (
        new Date(a.due_date) -
        new Date(b.due_date)
      );
    }

    if (sortBy === "dueDesc") {
      return (
        new Date(b.due_date) -
        new Date(a.due_date)
      );
    }

    if (sortBy === "amountHigh") {
      return (
        Number(b.amount) -
        Number(a.amount)
      );
    }

    if (sortBy === "amountLow") {
      return (
        Number(a.amount) -
        Number(b.amount)
      );
    }

    return 0;

  })
  .map((bill) => (

                <tr
                  key={bill.id}
                  className="
                    border-b
                    hover:bg-gray-50
                    transition
                  "
                >

                  <td className="p-4">
                    {bill.bill_name.charAt(0).toUpperCase() +
 bill.bill_name.slice(1)}
                  </td>

                  <td className="p-4">
                    ₹{Number(bill.amount).toLocaleString()}
                  </td>

                  <td className="p-4">

  <div className="flex items-center gap-3">

    <span>
      {new Date(
        bill.due_date
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </span>

    {bill.status !== "paid" &&
 getBillStatus(
   bill.due_date
 ) === "overdue" && (
      <span
        className="
          bg-red-100
          text-red-600
          text-xs
          px-2
          py-1
          rounded-full
          font-medium
        "
      >
        Overdue
      </span>
    )}

    {bill.status !== "paid" &&
 getBillStatus(
   bill.due_date
 ) === "dueSoon" && (
      <span
        className="
          bg-yellow-100
          text-yellow-700
          text-xs
          px-2
          py-1
          rounded-full
          font-medium
        "
      >
        Due Soon
      </span>
    )}

  </div>

</td>

     <td className="p-4">

  <div className="flex justify-start">

    <button
      onClick={() =>
        handleStatusChange(
          bill.id,
          bill.status === "paid"
            ? "unpaid"
            : "paid"
        )
      }
      className={
        bill.status === "paid"
          ? `
            bg-green-100
            text-green-600
            px-4
            py-2
            rounded-full
            font-medium
            hover:bg-green-200
            hover:scale-105
            transition-all
            duration-200
            min-w-[100px]
          `
          : `
            bg-red-100
            text-red-600
            px-4
            py-2
            rounded-full
            font-medium
            hover:bg-red-200
            hover:scale-105
            transition-all
            duration-200
            min-w-[100px]
          `
      }
    >
      {bill.status === "paid"
  ? "✓ Paid"
  : "✕ Unpaid"}
    </button>

  </div>

</td>


    <td className="p-4">

    <div className="flex justify-center gap-4">

    <FaEdit
  onClick={() =>
    handleEdit(bill)
  }
  className="
    text-blue-500
    cursor-pointer
    hover:scale-125
    hover:text-blue-700
    transition-all
    duration-200
  "
/>

    <FaTrash
  onClick={() =>
  openDeleteModal(bill.id)
}
  className="
    text-red-500
    cursor-pointer
    hover:scale-125
    hover:text-red-700
    transition-all
    duration-200
  "
/>

  </div>

</td>

                </tr>

              ))
            )}

            </tbody>

          </table>

        </div>

      </div>
      

      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[450px]">

      <h2 className="text-2xl font-bold mb-5">
  {isEditing
    ? "Edit Bill"
    : "Add Bill"}
</h2>

      <input
        type="text"
        placeholder="Bill Name"
        value={billName}
        onChange={(e) =>
          setBillName(e.target.value)
        }
        className="w-full border p-3 rounded-lg mb-3"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        className="w-full border p-3 rounded-lg mb-3"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
        className="w-full border p-3 rounded-lg mb-5"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
  onClick={
    isEditing
      ? handleUpdateBill
      : handleAddBill
  }
          className="bg-[#0B1437] text-white px-4 py-2 rounded-lg"
        >
          {isEditing
  ? "Update"
  : "Save"}
        </button>

      </div>

    </div>

  </div>
)}

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[400px]">

      <h2 className="text-xl font-bold mb-3">
        Delete Bill
      </h2>

      <p className="text-gray-600 mb-5">
        Are you sure you want to delete it?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowDeleteModal(false)
          }
          className="
            px-4 py-2
            border
            rounded-lg
          "
        >
          Cancel
        </button>

        <button
          onClick={() => {
            handleDelete(deleteId);
            setShowDeleteModal(false);
          }}
          className="
            bg-red-500
            text-white
            px-4 py-2
            rounded-lg
          "
        >
          Delete
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default RecurringBills;
