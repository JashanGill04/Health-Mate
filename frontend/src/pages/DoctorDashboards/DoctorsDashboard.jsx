""// src/pages/doctor/Dashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import {
  CalendarDays,
  Users,
  Download,
  Search,
  Info,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from "lucide-react";
import SettingsComponent from "../../components/MinorComponents/SettingsComponent";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import DoctorLayout from "../../layouts/DoctorLayout";
import { useAuthStore } from "../../contexts/AuthStore";

export default function DoctorDashboard() {
  const { authUser, isCheckingAuth } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointments/doctor/requests");
          console.log("Fetched appointments:", res.data); // Add this line

      setAppointments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const markCompleted = async (id) => {
    try {
      setLoadingId(id);
      await axiosInstance.patch(`/appointments/update/${id}`, { status: "completed" });
          await fetchAppointments();

    } catch (err) {
      console.error("Error marking completed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const name = appt.patientName || appt.patientId?.name || "";
    const reason = appt.reason || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportCSV = () => {
    const headers = ["Patient", "Date", "Time", "Reason"];
    const rows = filteredAppointments.map((a) => [
      a.patientName || a.patientId?.name,
      new Date(a.date).toLocaleDateString(),
      a.time,
      a.reason
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupByDate = (items, dateKey) => {
    const daily = items.reduce((acc, item) => {
      const date = new Date(item[dateKey]).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(daily)
      .map(([date, count]) => ({ date, count }))
      .slice(-7);
  };

  const dailyAppointments = groupByDate(appointments, "date");

  const statusCounts = appointments.reduce(
    (acc, a) => {
      acc.total++;
      if (a.status === "accepted") acc.accepted++;
      else if (a.status === "pending") acc.pending++;
      else if (a.status === "rejected") acc.rejected++;
      else if (a.status === "completed") acc.completed++;
      return acc;
    },
    { total: 0, accepted: 0, pending: 0, rejected: 0, completed: 0 }
  );

if (isCheckingAuth) {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}


  
  if (authUser.role !== "doctor") return <p className="text-red-500">Access denied</p>;

  return (
    <DoctorLayout>
      <div className="max-w-full mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl text-blue-700 font-bold mb-4">👨‍⚕️ Welcome, Doctor</h1>

          <div className=" bg-base-100 grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow text-center">
              <p className="text-2xl font-bold">{statusCounts.total}</p>
              <p className="text-sm">Total</p>
            </div>
            <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow text-center">
              <p className="text-2xl font-bold">{statusCounts.accepted}</p>
              <p className="text-sm">Accepted</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow text-center">
              <p className="text-2xl font-bold">{statusCounts.pending}</p>
              <p className="text-sm">Pending</p>
            </div>
            <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow text-center">
              <p className="text-2xl font-bold">{statusCounts.rejected}</p>
              <p className="text-sm">Rejected</p>
            </div>
            <div className="bg-purple-100 text-purple-800 p-4 rounded-xl shadow text-center">
              <p className="text-2xl font-bold">{statusCounts.completed}</p>
              <p className="text-sm">Completed</p>
            </div>
          </div>

          <div className="bg-base-100 shadow rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="text-blue-500" /> Appointment Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyAppointments}>
                <XAxis dataKey="date" fontSize={10} />
                <YAxis allowDecimals={false} fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-between items-center mt-8 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search patient/reason"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded border text-sm"
              />
            </div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
            >
              <Download size={16} /> CSV
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </p>

          {filteredAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <ul className="divide-y">
              {filteredAppointments.map(appt => {
                const isAccepted = appt.status === "accepted";
                return (
                  <li key={appt._id} className="py-3">
                    <div className="text-sm font-medium">{appt.patientId?.name || appt.patientName}</div>
                    <div className="text-xs text-gray-500">{appt.date} at {appt.time}</div>
                    <div className="text-xs italic text-gray-400">{appt.reason}</div>

                    {isAccepted && (
                      <button
                        onClick={() => markCompleted(appt._id)}
                        disabled={loadingId === appt._id}
                        className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                        {loadingId === appt._id ? "Updating..." : "Mark as Completed"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>

        <SettingsComponent />
      </div>
    </DoctorLayout>
  );
}
