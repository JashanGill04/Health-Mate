import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/doctors/all");
      setDoctors(res.data || []);
    } catch (err) {
      toast.error("Failed to load doctors");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointments/user");
      setAppointments(res.data || []);
    } catch (err) {
      toast.error("Failed to load appointments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !doctorId) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/appointments/create", {
        doctorId,
        date,
        time,
        reason,
      });
      toast.success("Appointment booked");
      setDate("");
      setTime("");
      setDoctorId("");
      setReason("");
      fetchAppointments();
    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-10 px-4">
        {/* Book Appointment */}
        <div className="bg-sky-950 p-6 rounded-xl shadow-lg border border-sky-900 text-white">
          <h2 className="text-2xl font-bold text-sky-300 mb-4">
            Book Appointment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="date"
              className="w-full px-4 py-2 border border-sky-800 rounded-lg bg-sky-900 text-white placeholder:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
            <input
              type="time"
              className="w-full px-4 py-2 border border-sky-800 rounded-lg bg-sky-900 text-white placeholder:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={loading}
            />
            <select
              className="w-full px-4 py-2 border border-sky-800 rounded-lg bg-sky-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              disabled={loading}
            >
              <option value="" className="bg-sky-950">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id} className="bg-sky-950">
                  Dr. {doc.userId.name} ({doc.specialization})
                </option>
              ))}
            </select>

            <div>
              <label className="block mb-1 text-sm font-medium text-sky-200">
                Reason for Appointment
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-sky-800 rounded-lg bg-sky-900 text-white placeholder:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. persistent headaches, anxiety, etc."
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-sky-700 hover:bg-sky-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>

        {/* Appointment List */}
        <div className="bg-sky-950 p-6 rounded-xl shadow-lg border border-sky-900 text-white">
          <h3 className="text-xl font-semibold text-sky-300 mb-4">
            Your Appointments
          </h3>
          {appointments.length === 0 ? (
            <p className="text-sky-300/70">No appointments yet.</p>
          ) : (
            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {appointments.map((appt) => (
                <li
                  key={appt._id}
                  className="border-b border-sky-800 pb-2 last:border-none"
                >
                  <div className="text-sky-100 text-sm space-y-1">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appt.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {appt.time}
                    </p>
                    <p>
                      <strong>Doctor:</strong> Dr.{" "}
                      {appt.doctorId?.userId.name || "Unknown"} (
                      {appt.doctorId?.specialization})
                    </p>
                    {appt.reason && (
                      <p>
                        <strong>Reason:</strong> {appt.reason}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
