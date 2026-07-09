import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(

        "/api/forgot-password",

        {
          email,
        }

      );

      toast.success(response.data.message);
      setEmail("");

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Something went wrong."
);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[420px]">

        <h1 className="text-3xl font-bold mb-2">

          Forgot Password

        </h1>

        <p className="text-gray-500 mb-6">

          Enter your registered email address to receive a password reset link.

        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-3 mb-5"
          />

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
p-3
rounded-lg
transition
duration-300
"
          >

            {loading
              ? "Sending..."
              : "Send Reset Link"}

          </button>

        </form>

        <div className="text-center mt-5">

          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >

            Back to Login

          </Link>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;