// src/pages/doctor/DoctorsAppointment.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { BadgeCheck, XCircle, User, Mail, Phone, Info, CalendarClock } from "lucide-react";
import { toast } from "react-hot-toast";
import DoctorLayout from "../../layouts/DoctorLayout";


export default function DoctorsAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointments/doctor/requests");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/appointments/update/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) return <p className="text-center">Loading appointments...</p>;

  return (
    <DoctorLayout>
  <div className="max-w-5xl mx-auto p-6 bg-slate-900 min-h-screen text-white">
    <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
      📋 Appointment Requests
    </h2>

    {appointments.length === 0 ? (
      <p className="text-gray-300 text-center">No appointment requests found.</p>
    ) : (
      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="p-4 rounded-xl shadow bg-slate-800 flex flex-col gap-2 border border-slate-700 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {appt.patientName || appt.patientId?.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {new Date(appt.date).toLocaleDateString()} at {appt.time}
                </p>
                <p className="text-sm text-gray-300 mt-1 italic">
                  Reason: {appt.reason}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {appt.status === "pending" ? (
                  <>
                    <button
                      onClick={() => updateStatus(appt._id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1"
                    >
                      <BadgeCheck size={16} /> Accept
                    </button>
                    <button
                      onClick={() => updateStatus(appt._id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appt.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                )}
                <button
                  onClick={() => toggleExpand(appt._id)}
                  className="text-sm text-blue-400 hover:underline ml-2"
                >
                  {expandedId === appt._id ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>

            {expandedId === appt._id && (
              <div className="mt-3 bg-slate-700 border border-slate-600 rounded-lg p-3 text-sm text-gray-200 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" /> Email: {appt.patientId?.email || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" /> Gender: {appt.patientId?.gender || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" /> Phone: {appt.patientId?.phone || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Info size={16} className="text-gray-400" /> Age: {appt.patientId?.age || "N/A"}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
</DoctorLayout>

    
  );
}
