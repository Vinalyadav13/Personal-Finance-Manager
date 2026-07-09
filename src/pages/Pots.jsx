import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function Pots() {
  const [pots, setPots] = useState([]);
  const [showAddMoneyModal, setShowAddMoneyModal] =
    useState(false);

  const [selectedPotId, setSelectedPotId] =
    useState(null);

  const [selectedPot, setSelectedPot] =
    useState(null);

  const [moneyAmount, setMoneyAmount] =
    useState("");

  const [showWithdrawModal, setShowWithdrawModal] =
    useState(false);

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);


  const [showModal, setShowModal] = useState(false);

  const [potName, setPotName] = useState("");

  const [targetAmount, setTargetAmount] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  useEffect(() => {
    fetchPots();
  }, []);

  const fetchPots = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/pots",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      setPots(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMoney = (id) => {
    setSelectedPotId(id);
    setShowAddMoneyModal(true);
  };

  const openWithdrawModal = (pot) => {
    setSelectedPot(pot);
    setShowWithdrawModal(true);
  };

  const saveMoneyToPot = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const currentPot = pots.find(
        (pot) => pot.id === selectedPotId
      );

      await axios.put(
        `http://localhost:5000/api/pots/add-money/${selectedPotId}`,
        {
          amount: moneyAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        "http://localhost:5000/api/transactions",
        {
          title: `Added to ${currentPot.pot_name}`,
          amount: moneyAmount,
          type: "expense",
          category: "Savings Pot",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPots();
      toast.success(
        "Money added successfully!"
      );

      setMoneyAmount("");
      setSelectedPotId(null);
      setShowAddMoneyModal(false);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Unable to add money."
      );

    }
  };

  const handleAddPot = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/pots",
        {
          pot_name: potName,
          target_amount: targetAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPots();
      toast.success("Pot added successfully!");

      setShowModal(false);

      setPotName("");
      setTargetAmount("");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Unable to add pot."
      );

    }
  };

  const handleWithdrawMoney = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const newAmount =
        Number(selectedPot.saved_amount) -
        Number(withdrawAmount);

      if (newAmount < 0) {
        toast.error(
          "Cannot withdraw more than saved amount"
        );
        return;
      }

      await axios.put(
        `http://localhost:5000/api/pots/${selectedPot.id}`,
        {
          pot_name:
            selectedPot.pot_name,

          target_amount:
            selectedPot.target_amount,

          saved_amount:
            newAmount,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        "http://localhost:5000/api/transactions",
        {
          title: `Withdrawn from ${selectedPot.pot_name}`,
          amount: withdrawAmount,
          type: "income",
          category: "Savings Pot",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPots();
      toast.success(
        "Money withdrawn successfully!"
      );
      setWithdrawAmount("");
      setSelectedPot(null);

      setShowWithdrawModal(false);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Unable to withdraw money."
      );

    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };


  const handleEdit = (pot) => {
    setIsEditing(true);

    setEditId(pot.id);

    setPotName(pot.pot_name);

    setTargetAmount(
      pot.target_amount
    );

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/pots/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchPots();
      toast.success(
        "Pot deleted successfully!"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Unable to delete pot."
      );

    }
  };

  const handleUpdatePot = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/pots/${editId}`,
        {
          pot_name: potName,
          target_amount: targetAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPots();
      toast.success(
        "Pot updated successfully!"
      );

      setShowModal(false);

      setIsEditing(false);
      setEditId(null);

      setPotName("");
      setTargetAmount("");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Unable to update pot."
      );

    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-72 p-8 bg-gray-100 page-fade">
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-4xl font-bold">
            Pots
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
    hover:shadow-lg
    hover:-translate-y-1
    transition-all
    duration-300
  "
          >
            + New Pot
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6">

          {pots.map((pot, index) => {
            const percentage =
              (pot.saved_amount / pot.target_amount) * 100;

            return (
              <div
                key={pot.id}
                className="
    bg-white
    p-5
    rounded-xl
    shadow
    hover:shadow-lg
    hover:-translate-y-1
    transition-all
    duration-300
  "
                style={{
                  borderLeft: `5px solid ${[
                      "#2D9C95",
                      "#7F6C8D",
                      "#82D3E0",
                      "#F0D0A7",
                    ][index % 4]
                    }`,
                }}
              >
                <div className="flex justify-between items-center mb-3">

                  <div className="flex justify-between items-center mb-3 gap-4">

                    <h2 className="text-xl font-bold">
                      {pot.pot_name
                        .split(" ")
                        .map(
                          word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ")}
                    </h2>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleAddMoney(pot.id)}
                        className="
  bg-sky-100
  text-sky-700
  px-4
  py-2
  rounded-xl
  border
  border-sky-200
  hover:bg-sky-200
  hover:shadow-md
  transition-all
  duration-300
"
                      >
                        + Add Money
                      </button>

                      <button
                        onClick={() => openWithdrawModal(pot)}

                        className="
  bg-sky-100
  text-sky-700
  px-4
  py-2
  rounded-xl
  border
  border-sky-200
  hover:bg-sky-200
  hover:shadow-md
  transition-all
  duration-300
"
                      >
                        Withdraw
                      </button>

                    </div>

                  </div>

                  <div className="flex gap-4 self-start">

                    <button
                      onClick={() => handleEdit(pot)}
                      className="
  p-2
  rounded-lg
  text-blue-500
  hover:bg-blue-50
  hover:text-blue-700
  transition
"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        openDeleteModal(pot.id)
                      }
                      className="
  p-2
  rounded-lg
  text-red-500
  hover:bg-red-50
  hover:text-red-700
  transition
"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Saved
                    </p>

                    <p className="text-xl font-bold">
                      ₹{Number(pot.saved_amount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-500 text-sm">
                      Target
                    </p>

                    <p className="text-lg font-semibold">
                      ₹{Number(pot.target_amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Progress
                    </span>
                    <span className="font-semibold text-green-600">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="
    bg-green-500
    h-2.5
    rounded-full
    transition-all
    duration-700
  "
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Edit Pot" : "Add Pot"}
            </h2>

            <input
              type="text"
              placeholder="Pot Name"
              value={potName}
              onChange={(e) =>
                setPotName(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-3"
            />

            <input
              type="number"
              placeholder="Target Amount"
              value={targetAmount}
              onChange={(e) =>
                setTargetAmount(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowModal(false);

                  setIsEditing(false);
                  setEditId(null);

                  setPotName("");
                  setTargetAmount("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={
                  isEditing
                    ? handleUpdatePot
                    : handleAddPot
                }
                className="bg-[#0B1437] text-white px-4 py-2 rounded-lg"
              >
                {isEditing ? "Update" : "Save"}
              </button>

            </div>

          </div>

        </div>
      )}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-2xl font-bold mb-4">
              Add Money
            </h2>

            <input
              type="number"
              placeholder="Amount"
              value={moneyAmount}
              onChange={(e) =>
                setMoneyAmount(e.target.value)
              }
              className="
          w-full
          border
          p-3
          rounded-lg
          mb-4
        "
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowAddMoneyModal(false)
                }
                className="
            px-4
            py-2
            border
            rounded-lg
          "
              >
                Cancel
              </button>

              <button
                onClick={saveMoneyToPot}
                className="
            bg-green-500
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-green-600
          "
              >
                Add
              </button>

            </div>

          </div>

        </div>
      )}

      {showWithdrawModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-2xl font-bold mb-4">
              Withdraw Money
            </h2>

            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) =>
                setWithdrawAmount(
                  e.target.value
                )
              }
              className="
          w-full
          border
          p-3
          rounded-lg
          mb-4
        "
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setSelectedPot(null);
                  setWithdrawAmount("");
                }}
                className="
            px-4
            py-2
            border
            rounded-lg
          "
              >
                Cancel
              </button>

              <button
                onClick={handleWithdrawMoney}
                className="
            bg-red-500
            text-white
            px-4
            py-2
            rounded-lg
          "
              >
                Withdraw
              </button>

            </div>

          </div>

        </div>

      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-bold mb-3">
              Delete Pot
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

export default Pots;
