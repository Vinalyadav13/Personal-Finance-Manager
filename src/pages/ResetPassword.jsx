import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {

      toast.error("Passwords do not match.");

      return;

    }

    try {

      setLoading(true);

      const response = await axios.post(

        `http://localhost:5000/api/reset-password/${token}`,

        {
          password,
        }

      );

      toast.success(response.data.message);

setTimeout(() => {

  navigate("/");

}, 1500);

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Unable to reset password."
);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white rounded-xl shadow-lg p-8 w-[430px]">

        <h1 className="text-3xl font-bold mb-2">

          Reset Password

        </h1>

        <p className="text-gray-500 mb-6">

          Enter your new password below.

        </p>

        <form onSubmit={handleSubmit}>

          <div className="relative mb-5">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="New Password"
    className="w-full border rounded-xl p-4 pr-12"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

<div className="relative mb-6">
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Confirm Password"
    className="w-full border rounded-xl p-4 pr-12"
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

          

          <button
  type="submit"
  disabled={loading}
  className="
    w-full
    bg-blue-600
    hover:bg-blue-700
    disabled:bg-gray-400
    disabled:cursor-not-allowed
    text-white
    py-4
    rounded-xl
    mt-2
    transition
  "
>
  {loading
  ? "Resetting..."
  : "Reset Password"}
</button>

        </form>

      </div>

    </div>

  );

}

export default ResetPassword;