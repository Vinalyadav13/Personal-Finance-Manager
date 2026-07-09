import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);
const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [deleteId, setDeleteId] =
  useState(null);

  const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [type, setType] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN FROM STORAGE:", token);

const response = await axios.get(
  "/api/transactions",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setTransactions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

     const handleAddTransaction = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "/api/transactions",
      {
        title,
        amount,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTitle("");
    setAmount("");
    setType("");

    setShowModal(false);

    fetchTransactions();
  } catch (error) {
    console.log(error);
  }
};

const openDeleteModal = (id) => {
  console.log("Delete clicked");
  setDeleteId(id);
  setShowDeleteModal(true);
};

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `/api/transactions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTransactions();
  } catch (error) {
    console.log(error);
  }
};

const filteredTransactions = transactions
  .filter((transaction) =>
    transaction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .filter((transaction) =>
    filterType === "all"
      ? true
      : transaction.type === filterType
  )
  .sort((a, b) => {
    if (sortBy === "highest")
      return b.amount - a.amount;

    if (sortBy === "lowest")
      return a.amount - b.amount;

    if (sortBy === "oldest")
      return (
        new Date(a.created_at) -
        new Date(b.created_at)
      );

    return (
      new Date(b.created_at) -
      new Date(a.created_at)
    );
  });

const totalPages = Math.ceil(
  filteredTransactions.length /
  transactionsPerPage
);

const paginatedTransactions =
  filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handleEdit = (transaction) => {
  setIsEditing(true);

  setEditId(transaction.id);

  setTitle(transaction.title);
  setAmount(transaction.amount);
  setType(transaction.type);

  setShowModal(true);
};

const handleUpdateTransaction = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `/api/transactions/${editId}`,
      {
        title,
        amount,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTransactions();

    setShowModal(false);

    setIsEditing(false);
    setEditId(null);

    setTitle("");
    setAmount("");
    setType("");
  } catch (error) {
    console.log(error);
  }
};

  return (
  <div className="flex h-screen">
    <Sidebar />

    
        <div className="flex-1 ml-72 p-8 bg-gray-100 overflow-y-auto page-fade">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-4xl font-bold">
    Transactions
  </h1>

  <button
  onClick={() => setShowModal(true)}
  className="bg-[#0B1437] text-white px-5 py-3 rounded-lg hover:opacity-90"
>
  + New Transaction
</button>
</div>

<div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between items-center mb-6">

  <input
    type="text"
    placeholder="🔍 Search transactions..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="
border
rounded-xl
px-4
py-3
focus:ring-2
focus:ring-[#0B1437]
focus:outline-none
transition-all
duration-200
"
  />

  <div className="flex gap-3">

  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="
      border
      border-gray-300
      px-4
      py-2.5
      rounded-lg
      bg-white
      focus:outline-none
      focus:ring-2
      focus:ring-[#0B1437]
    "
  >
    <option value="all">All</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="
    border
    border-gray-300
    px-4
    py-2.5
    rounded-lg
    bg-white
    focus:outline-none
    focus:ring-2
    focus:ring-[#0B1437]
  "
>
  <option value="latest">Latest First</option>
  <option value="oldest">Oldest First</option>
  <option value="highest">Highest Amount</option>
  <option value="lowest">Lowest Amount</option>
</select>

</div>

</div>

<table className="w-full table-auto mb-8">
          <thead>
            <tr className="border-b">
              <th className="w-[30%] text-left py-3 px-3">
  Title
</th>

<th className="w-[25%] text-left py-3 px-3">
  Amount
</th>

<th className="w-[15%] text-left py-3 px-3">
  Type
</th>

<th className="w-[15%] text-left py-3 px-3">
  Date
</th>

<th className="w-[15%] text-center py-3 px-3">
  Actions
</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr
  key={transaction.id}
  className="
    border-b
    hover:bg-gray-50
    transition-all
    duration-200
  "
>
                <td className="py-2 px-3">
                  <td className="p-3">
  {transaction.title.charAt(0).toUpperCase() +
    transaction.title.slice(1)}
</td>
                </td>

                <td className="py-2 px-3">
                  <td className="p-3 font-medium">
  ₹{Number(transaction.amount).toLocaleString()}
</td>
                </td>

                <td className="py-2 px-3">
  <span
  className={`inline-block min-w-[110px] text-center px-4 py-1 rounded-full hover:scale-105 transition-all duration-200 ${
    transaction.type === "income"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {transaction.type}
</span>
</td>
                <td className="py-2 p-3 text-gray-500">
  {new Date(transaction.created_at).toLocaleDateString(
  "en-GB",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
)}
</td>
                
 <td className="w-24 py-2 px-2 text-center">
  <div className="inline-flex justify-center items-center gap-4">

    <button
    onClick={() =>
    handleEdit(transaction)
  }
      className="
        flex items-center justify-center
        w-10 h-10
        rounded-full
        text-blue-500
        transition-all
        duration-200
        hover:bg-blue-100
        hover:text-blue-700
        hover:scale-110
      "
    >
      <FaEdit size={18} />
    </button>

    <button
      onClick={() =>
  openDeleteModal(transaction.id)
}
      className="
        flex items-center justify-center
        w-10 h-10
        rounded-full
        text-red-500
        transition-all
        duration-200
        hover:bg-red-100
        hover:text-red-700
        hover:scale-110
      "
    >
      <FaTrash size={18} />
    </button>

  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center gap-2">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
    className="
border
px-5
py-2
rounded-lg
hover:bg-[#0B1437]
hover:text-white
transition-all
duration-200
"
  >
    Previous
  </button>

  <span className="font-medium">
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
    className="
border
px-5
py-2
rounded-lg
hover:bg-[#0B1437]
hover:text-white
transition-all
duration-200
"
  >
    Next
  </button>

</div>
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-[400px]">
      <h2 className="text-2xl font-bold mb-4">
  {isEditing
    ? "Edit Transaction"
    : "Add Transaction"}
</h2>

      <input
  type="text"
  placeholder="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full border p-3 rounded-lg mb-3"
/>

      <input
  type="number"
  placeholder="Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="w-full border p-3 rounded-lg mb-3"
/>

      <select
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
>

        <option value="">
          Select Type
        </option>

        <option value="income">
          Income
        </option>

        <option value="expense">
          Expense
        </option>
      </select>

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
      ? handleUpdateTransaction
      : handleAddTransaction
  }
  className="bg-[#0B1437] text-white px-4 py-2 rounded-lg"
>
  {isEditing ? "Update" : "Save"}
</button>
      </div>
    </div>
  </div>
)}


{showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[400px]">

      <h2 className="text-xl font-bold mb-3">
        Delete Transaction
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
        </div>


  );
}



export default Transactions;
