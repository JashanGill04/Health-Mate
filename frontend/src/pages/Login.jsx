import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../contexts/AuthStore";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
  
  const navigate = useNavigate();
  const { login, authUser, authRole, isCheckingAuth } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData);
    if (result.success) {
      toast.success("Login successful");
      if (authRole === "doctor") navigate("/doctor/dashboard");
      else navigate("/home");
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  };

  // Optional: Redirect if already logged in
  useEffect(() => {
    if (!isCheckingAuth && authUser) {
     
      if (authRole === "doctor") navigate("/doctor/dashboard");
      else navigate("/home");
    }
  }, [authUser, authRole, isCheckingAuth]);

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-4 text-white text-left">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
  <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>


      </form>
    </AuthLayout>
  );
};

export default Login;
