import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        setUserId(res.data._id);
        fetchLogs(res.data._id);
      } catch (err) {
        toast.error("Failed to load user");
      }
    };

    getUser();
  }, []);

  const fetchLogs = async (uid) => {
    try {
      const res = await axiosInstance.get(`/symptoms/user/${uid}`);
      setLogs(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch symptom logs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error("Please enter some symptoms");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/symptoms/add", { symptoms, date });
      toast.success("Symptom log saved!");
      setSymptoms("");
      if (userId) fetchLogs(userId);
    } catch (err) {
      toast.error("Failed to save symptom log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-8 text-slate-100">

        {/* Form */}
        <div className="bg-slate-900 p-6 rounded-xl shadow border border-slate-700">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">Log Your Symptoms</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows="4"
              placeholder="Describe your symptoms (e.g. headache, fatigue, sore throat)..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={loading}
            />
            <input
              type="date"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging..." : "Submit Symptom Log"}
            </button>
          </form>
        </div>

        {/* Logs */}
        <div className="bg-slate-900 p-6 rounded-xl shadow border border-slate-700">
          <h3 className="text-xl font-semibold text-blue-300 mb-4">Previous Logs</h3>
          {logs.length === 0 ? (
            <p className="text-slate-400">No symptom logs found.</p>
          ) : (
            <ul className="space-y-4 max-h-72 overflow-auto pr-2">
              {logs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((log) => (
                  <li key={log._id} className="border-b border-slate-700 pb-2">
                    <div className="text-white whitespace-pre-line">{log.symptoms}</div>
                    <div className="text-sm text-slate-400 mt-1 flex justify-between">
                      <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                      <div>{new Date(log.createdAt).toLocaleTimeString()}</div>
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
