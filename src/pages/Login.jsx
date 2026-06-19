import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] =
  useState(false);
    
const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    alert("Login Successful");

    navigate("/dashboard");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Login Failed"
    );
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-6">
          Finance App
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
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

        <button
           onClick={handleLogin}
           className="w-full bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 transition"
           >
           Sign In
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-slate-900 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;