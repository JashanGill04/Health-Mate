import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
const navigate = useNavigate();
  const fetchDoctor = async () => {
    try {
      const res = await axiosInstance.get(`/doctors/user/${id}`);
      setDoctor(res.data);
    } catch (err) {
      toast.error("Failed to load doctor profile");
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (!doctor) return <div className="text-center text-white p-8">Loading...</div>;

  const user = doctor.userId;

  return (
 <DashboardLayout>
  <div className="max-w-4xl mx-auto bg-white dark:bg-[#162c49] shadow-2xl rounded-3xl p-8 mt-10 text-gray-800 dark:text-white">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-6">
        <img
          src={
            user?.profilePicture
              ? user.profilePicture
              : "/default-doctor.jpg"
          }
          alt={user?.name}
          className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold">{user?.name}</h2>
          <p className="text-blue-500 font-medium text-lg">
            {doctor.specialization}
          </p>
          {user?.bio && (
            <p className="mt-3 italic text-gray-600 dark:text-blue-100 bg-blue-50 dark:bg-blue-950 p-3 rounded-xl shadow-inner">
              “{user.bio}”
            </p>
          )}
        </div>
      </div>
      <button
      
        onClick={() => navigate("/appointments")}
        className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        Book Appointment
      </button>
    </div>

    {/* Details */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-base">
      <div>
        <p className="font-semibold text-blue-600 dark:text-blue-300">Age</p>
        <p>{user?.age}</p>
      </div>
      <div>
        <p className="font-semibold text-blue-600 dark:text-blue-300">Gender</p>
        <p>{user?.gender}</p>
      </div>
      <div>
        <p className="font-semibold text-blue-600 dark:text-blue-300">Phone</p>
        <p>{user?.phone}</p>
      </div>
      <div>
        <p className="font-semibold text-blue-600 dark:text-blue-300">Email</p>
        <p>{user?.email}</p>
      </div>
      <div>
        <p className="font-semibold text-blue-600 dark:text-blue-300">Contact Info</p>
        <p>{doctor.contactInfo}</p>
      </div>
    </div>

    {/* Availability */}
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-4">
        Availability
      </h3>
      {doctor.availability?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {doctor.availability.map((slot, index) => (
            <div
              key={index}
              className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-4 py-3 rounded-lg shadow flex items-center justify-between"
            >
              <span className="font-semibold">{slot.day}</span>
              <span className="bg-blue-300 dark:bg-blue-700 text-sm px-3 py-1 rounded-full">
                {slot.time}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No availability set</p>
      )}
    </div>
  </div>
</DashboardLayout>


  );
}
