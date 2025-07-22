import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { Bot } from "lucide-react";
import SettingsComponent from "../../components/MinorComponents/SettingsComponent";
import PersonalizedEducation from "../PersonalizedEducation";

export default function DashboardOverview() {
  const [appointments, setAppointments] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointments/user");
      setAppointments(res.data); // don't slice here
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", { prompt: chatInput });
      setChatResponse(res.data?.reply || "No response");
    } catch (error) {
      console.error("AI chat error:", error);
      setChatResponse("Sorry, something went wrong.");
    }
    setChatLoading(false);
  };

  // Separate appointments by status
  const groupedAppointments = {
    accepted: appointments.filter(a => a.status === "accepted"),
    rejected: appointments.filter(a => a.status === "rejected"),
    pending: appointments.filter(a => a.status === "pending"),
  };

  const renderAppointmentList = (title, list, color = "text-blue-300") => (
    <div>
      <h4 className={`text-md font-semibold mb-2 ${color}`}>{title}</h4>
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">None</p>
      ) : (
        <ul className="space-y-2 text-sm text-gray-300">
          {list.slice(0, 5).map((appt) => (
            <li key={appt._id} className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
              <div>
                <span className="font-medium text-blue-200">{appt.patientName}</span> with{" "}
                <span className="text-blue-100">{appt.doctorId?.userId?.name || "Doctor"}</span>
              </div>
              <div className="text-xs text-gray-400">
                On <span>{new Date(appt.date).toLocaleDateString()}</span> at {appt.time}
              </div>
              <div className="text-xs mt-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    appt.status === "accepted"
                      ? "text-green-400"
                      : appt.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-300"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 text-gray-100">
      <SettingsComponent />

      {/* 🧠 Mental Health Chat */}
      <div className="bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <Bot className="text-sky-400" /> Mental Health Chat
        </h3>
        <form onSubmit={handleChatSubmit} className="flex gap-3 mb-4">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Hi there, how are you feeling today?"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            {chatLoading ? "Thinking..." : "Send"}
          </button>
        </form>
        {chatResponse && (
          <div className="bg-gray-900 text-gray-200 rounded-lg p-4 text-sm border border-gray-700 whitespace-pre-wrap">
            {chatResponse}
          </div>
        )}
      </div>

      {/* 📅 Appointments By Status */}
      <div className="bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
          🗓 Your Appointments
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {renderAppointmentList("Accepted", groupedAppointments.accepted, "text-green-400")}
          {renderAppointmentList("Pending", groupedAppointments.pending, "text-yellow-300")}
          {renderAppointmentList("Rejected", groupedAppointments.rejected, "text-red-400")}
        </div>
      </div>

      {/* 🎓 Personalized Education */}
      <div className="bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-700">
        <PersonalizedEducation />
      </div>
    </div>
  );
}
