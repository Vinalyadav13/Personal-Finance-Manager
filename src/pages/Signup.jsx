import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";



function Signup() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Finance App
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <div className="relative mb-4">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    className="
      w-full
      border
      border-gray-300
      p-4
      pr-12
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-slate-900
    "
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-gray-500
      hover:text-gray-700
    "
  >
    {showPassword
      ? <FaEyeSlash />
      : <FaEye />}
  </button>

</div>

        <div className="relative mb-4">

  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
    className="
      w-full
      border
      border-gray-300
      p-3
      pr-12
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-slate-900
    "
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-gray-500
      hover:text-gray-700
    "
  >
    {showConfirmPassword
      ? <FaEyeSlash />
      : <FaEye />}
  </button>

</div>

        <button className="w-full bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 transition">
          Sign Up
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-slate-900 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;