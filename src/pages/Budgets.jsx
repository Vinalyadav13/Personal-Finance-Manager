import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";


function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
const [category, setCategory] = useState("");
const [amount, setAmount] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/budgets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBudgets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBudget = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/budgets",
      {
        category,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCategory("");
    setAmount("");

    setShowModal(false);

    fetchBudgets();
  } catch (error) {
    console.log(error.response?.data);
    console.log(error);
  }
};

const handleEdit = (budget) => {
  setIsEditing(true);

  setEditId(budget.id);

  setCategory(budget.category);
  setAmount(budget.amount);

  setShowModal(true);
};

const handleUpdateBudget = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/budgets/${editId}`,
      {
        category,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBudgets();

    setShowModal(false);

    setIsEditing(false);
    setEditId(null);

    setCategory("");
    setAmount("");
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/budgets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBudgets();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      
        <div className="flex-1 ml-72 p-8 bg-gray-100 overflow-auto page-fade">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
    Budgets
  </h1>

  <button
    onClick={() => setShowModal(true)}
    className="
      bg-[#0B1437]
      text-white
      px-5
      py-3
      rounded-lg
      hover:opacity-90
    "
  >
    + New Budget
  </button>
</div>

<p className="text-gray-500 mb-6">
  {budgets.length} Categories
</p>

<div className="grid grid-cols-2 gap-6">

      {budgets.map((budget, index) => (

  <div
    key={budget.id}
    className="
      bg-white
      rounded-xl
      p-5
      shadow
      hover:shadow-lg
      transition
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

    <div className="flex justify-between items-start">

      <div>

        <h3 className="text-xl font-semibold">
          {budget.category
  .split(" ")
  .map(
    (word) =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
  )
  .join(" ")
}
        </h3>

        <p className="text-2xl font-semibold mt-2">
          ₹{Number(
            budget.amount
          ).toLocaleString()}
        </p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            handleEdit(budget)
          }
          className="
            text-blue-500
            hover:text-blue-700
          "
        >
          <FaEdit />
        </button>

        <button
          onClick={() =>
            handleDelete(
              budget.id
            )
          }
          className="
            text-red-500
            hover:text-red-700
          "
        >
          <FaTrash />
        </button>

      </div>

    </div>

  </div>

))}


</div>
        
        

      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[400px]">

      <h2 className="text-2xl font-bold mb-4">
  {isEditing ? "Edit Budget" : "Add Budget"}
</h2>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
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
        className="w-full border p-3 rounded-lg mb-4"
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
      ? handleUpdateBudget
      : handleAddBudget
  }
  className="bg-[#0B1437] text-white px-4 py-2 rounded-lg"
>
  {isEditing ? "Update" : "Save"}
</button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default Budgets;