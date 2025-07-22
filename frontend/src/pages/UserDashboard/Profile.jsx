import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import {
  Activity,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function UserProfileStats() {
  const [user, setUser] = useState(null);
  const [symptomCount, setSymptomCount] = useState(0);
  const [suggestionCount, setSuggestionCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [dailySymptoms, setDailySymptoms] = useState([]);
  const [dailySuggestions, setDailySuggestions] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await axiosInstance.get("/auth/check");
        const userData = userRes.data;
        setUser(userData);

        const [symptomsRes, suggestionsRes, appointmentsRes] = await Promise.all([
          axiosInstance.get(`/symptoms/user/${userData._id}`),
          axiosInstance.get(`/ai/history`),
          axiosInstance.get(`/appointments/user`),
        ]);

        const symptoms = symptomsRes.data || [];
        const suggestions = suggestionsRes.data || [];
        const appointments = appointmentsRes.data || [];

        setSymptomCount(symptoms.length);
        setSuggestionCount(suggestions.length);
        setAppointmentCount(appointments.length);

        const groupByDate = (items, dateKey) => {
          const grouped = items.reduce((acc, item) => {
            const date = new Date(item[dateKey]).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});
          return Object.entries(grouped)
            .map(([date, count]) => ({ date, count }))
            .slice(-7);
        };

        setDailyAppointments(groupByDate(appointments, "date"));
        setDailySymptoms(groupByDate(symptoms, "createdAt"));
        setDailySuggestions(groupByDate(suggestions, "createdAt"));
      } catch (err) {
        toast.error("Failed to load profile stats");
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!user)
    return <div className="text-center py-20 text-gray-300">Loading profile...</div>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-2">
              Welcome, {user.name}!
            </h2>
            <p className="text-sm text-gray-400">Role: {user.role}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-4 rounded-xl shadow text-center">
              <HeartPulse className="mx-auto mb-2 text-pink-400" />
              <p className="text-xl font-semibold text-pink-400">{symptomCount}</p>
              <p className="text-sm text-gray-300">Symptom Logs</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-xl shadow text-center">
              <Activity className="mx-auto mb-2 text-green-400" />
              <p className="text-xl font-semibold text-green-400">{suggestionCount}</p>
              <p className="text-sm text-gray-300">AI Suggestions</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-xl shadow text-center">
              <Stethoscope className="mx-auto mb-2 text-purple-400" />
              <p className="text-xl font-semibold text-purple-400">{appointmentCount}</p>
              <p className="text-sm text-gray-300">Appointments</p>
            </div>
          </div>

          {/* Appointments Chart */}
          <div className="bg-slate-800 shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">📊 Appointments This Week</h3>
            {dailyAppointments.length === 0 ? (
              <p className="text-sm text-gray-400">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyAppointments}>
                  <XAxis dataKey="date" fontSize={10} stroke="#cbd5e1" />
                  <YAxis allowDecimals={false} fontSize={10} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }} />
                  <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Symptom Logs Chart */}
          <div className="bg-slate-800 shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">📈 Symptom Logs This Week</h3>
            {dailySymptoms.length === 0 ? (
              <p className="text-sm text-gray-400">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailySymptoms}>
                  <XAxis dataKey="date" fontSize={10} stroke="#cbd5e1" />
                  <YAxis allowDecimals={false} fontSize={10} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }} />
                  <Bar dataKey="count" fill="#f472b6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* AI Suggestions Chart */}
          <div className="bg-slate-800 shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">🤖 AI Suggestions This Week</h3>
            {dailySuggestions.length === 0 ? (
              <p className="text-sm text-gray-400">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailySuggestions}>
                  <XAxis dataKey="date" fontSize={10} stroke="#cbd5e1" />
                  <YAxis allowDecimals={false} fontSize={10} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }} />
                  <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
