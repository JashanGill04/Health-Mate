import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";

export default function BrowseDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/doctors/all");
      setDoctors(res.data || []);
    } catch (err) {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.userId?.name?.toLowerCase() || "";
    const spec = doc.specialization?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) || spec.includes(search.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-300">👨‍⚕️ Browse Doctors</h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by name or specialization..."
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-[#1a365d] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Doctors grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="group relative bg-[#162c49] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col items-center text-center w-full max-w-sm mx-auto"
            >
              <img
                src={
                  doc.userId?.profilePicture
                    ? doc.userId.profilePicture
                    : "/default-doctor.jpg"
                }
                alt={doc.userId?.name || "Doctor"}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition mb-4"
              />
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                {doc.userId?.name}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {doc.specialization || "General Physician"}
              </p>

              {/* Appointment button */}
              <button
                onClick={() => navigate("/appointments")}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition"
              >
                Book Appointment
              </button>

              <Link
                to={`/doctors/${doc.userId._id}`}
                className="mt-3 text-xs text-blue-300 hover:text-blue-400 underline"
              >
                View Profile
              </Link>

              <div className="absolute top-0 right-0 bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-bl-xl font-semibold">
                Doctor
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <p className="text-gray-400 text-center col-span-full">
              No doctors found.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
