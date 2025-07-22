import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../api/axiosConfig"; 
import { useAuthStore } from "../contexts/AuthStore";


export default function Register() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((state) => state);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient"
  });
    const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  setLoading(true);

  try {
  const res = await axiosInstance.post("/auth/signup", formData);
  const user = res.data;

  // ✅ Update Zustand auth store
  setAuthUser.authUser = user;
  setAuthUser.authRole = user.role;

  toast.success("Registered successfully!");

  if (user.role === "doctor") {
    navigate("/doctor/dashboard");
  } else {
    navigate("/home");
  }
} catch (err) {
  const msg = err.response?.data?.message || "Registration failed";
  toast.error(msg);
} finally {
  setLoading(false);
}

  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4 text-white text-left">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.password}
          onChange={handleChange}
          required
        />

       <select
  name="role"
  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400  text-gray-400"
  value={formData.role}
  onChange={handleChange}
  required
>
  <option className=" text-gray-800" value="patient">Patient</option>
  <option className=" text-gray-800" value="doctor">Doctor</option>
</select>


        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
           {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
