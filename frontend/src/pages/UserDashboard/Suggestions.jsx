import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AISuggestions() {
  const [symptoms, setSymptoms] = useState();
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get("/ai/history");
      setHistory(res.data || []);
    } catch (err) {
      toast.error("Failed to load suggestions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error("Please enter symptoms");
      return;
    }

    setLoading(true);
    try {
      const symptomArray = symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await axiosInstance.post("/ai/suggest", {
        symptoms: symptomArray,
      });
      setSuggestion(res.data?.suggestion);
      toast.success("Suggestion generated");
      setSymptoms("");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to generate suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 px-4">
        {/* Form Section */}
        <div className="bg-[#0a192f] p-6 rounded-xl shadow border border-blue-900">
          <h2 className="text-2xl text-blue-400 font-bold mb-4">
            AI Health Suggestion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows="4"
              placeholder="Enter symptoms (e.g. cough, fever, body ache)..."
              className="w-full px-4 py-3 bg-[#112240] border border-blue-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Generating..." : "Get AI Suggestion"}
            </button>
          </form>

          {suggestion && (
            <div className="mt-6 bg-blue-950/40 border border-blue-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-300 mb-2">
                Suggestion:
              </h4>
              <p className="text-gray-200 whitespace-pre-line">{suggestion}</p>
            </div>
          )}
        </div>

        {/* Past Suggestions Section */}
        <div className="bg-[#0a192f] p-6 rounded-xl shadow border border-blue-900">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            Previous Suggestions
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-400">No suggestions yet.</p>
          ) : (
            <ul className="space-y-4 max-h-80 overflow-auto pr-2">
              {history.map((item) => (
                <li
                  key={item._id}
                  className="border-b border-blue-800 pb-2 last:border-none"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                  <div className="text-gray-200 whitespace-pre-line">
                    <span className="font-medium text-blue-300">Input:</span>{" "}
                    {item.symptoms}
                    <br />
                    <span className="font-medium text-green-300">Suggestion:</span>{" "}
                    {item.suggestion}
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
