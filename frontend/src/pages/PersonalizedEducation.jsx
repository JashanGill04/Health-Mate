import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useAuthStore } from "../contexts/AuthStore";

export default function PersonalizedEducation() {
  const { authUser, isCheckingAuth } = useAuthStore();

  const [allArticles, setAllArticles] = useState([]);
  const [personalizedArticles, setPersonalizedArticles] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedTag, setSelectedTag] = useState("recommended");
  const [searchTerm, setSearchTerm] = useState("");
  const [tip, setTip] = useState("");
  const [tipLoading, setTipLoading] = useState(false);
  const [modalArticle, setModalArticle] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // NEW toggle state

  // Fetch articles
  useEffect(() => {
    const fetchContent = async () => {
      if (!authUser || isCheckingAuth) return;

      try {
        const [personalizedRes, allRes] = await Promise.all([
          axiosInstance.get(`/education/personalized/${authUser._id}`),
          axiosInstance.get(`/education/`)
        ]);

        setPersonalizedArticles(personalizedRes.data);
        setAllArticles(allRes.data);
      } catch (err) {
        console.error("Error fetching content", err);
      }
    };

    fetchContent();
  }, [authUser, isCheckingAuth]);

  // Filter logic
  useEffect(() => {
    let source = selectedTag === "recommended" ? personalizedArticles : allArticles;
    let result = [...source];

    if (selectedTag !== "recommended" && selectedTag !== "all") {
      result = result.filter((item) => item.tags.includes(selectedTag));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.body.toLowerCase().includes(term)
      );
    }

    setFilteredList(result);
  }, [selectedTag, searchTerm, allArticles, personalizedArticles]);

  const uniqueTags = Array.from(new Set(allArticles.flatMap(item => item.tags)));
  const allTags = ["all", ...uniqueTags];

  const fetchHealthTip = async () => {
    if (!authUser) return;
    setTipLoading(true);
    setTip("");

    try {
      const res = await axiosInstance.get(`/education/tip/${authUser._id}`);
      setTip(res.data.suggestion);
    } catch {
      setTip("Failed to fetch tip.");
    } finally {
      setTipLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto font-sans text-slate-200">
      {/* AI Tip Generator */}
      <div className="mb-8 bg-gray-900 border border-gray-700 p-5 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-blue-400">🧠 Want a health tip?</h3>
          <button
            onClick={fetchHealthTip}
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
            disabled={tipLoading}
          >
            {tipLoading ? "Generating..." : "Generate Tip"}
          </button>
        </div>
        {tip && (
          <div className="mt-3 p-4 bg-[#152232] border border-blue-800 rounded-xl shadow text-sm text-white">
            <p className="mb-2">{tip}</p>
            <button
              className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 transition"
              onClick={() => setTip("")}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Search + Title */}
      <h3 className="text-xl font-bold text-blue-400 mb-4">🎯 Recommended for You</h3>
      <input
        type="text"
        placeholder="Search articles..."
        className="w-full mb-4 p-3 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Toggle Filters */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm text-gray-400">Filter by tags</h4>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="text-sm text-blue-500 hover:underline focus:outline-none"
        >
          {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>
      </div>

      {/* Filter Buttons */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {["recommended", ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full border transition text-sm ${
                selectedTag === tag
                  ? "bg-blue-700 text-white font-semibold shadow"
                  : tag === "recommended"
                  ? "border-blue-600 text-blue-600 hover:bg-blue-100"
                  : "border-slate-600 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {tag === "recommended" ? "Recommended" : tag}
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {filteredList.length === 0 ? (
        <p className="text-center text-gray-400">No content matches your filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow hover:shadow-lg transition-all p-5"
            >
              <h3 className="text-xl font-semibold text-blue-500 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                {item.body.slice(0, 200)}...
              </p>
              <button
                onClick={() => setModalArticle(item)}
                className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Read More
              </button>
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalArticle && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setModalArticle(null)}
        >
          <div
            className="bg-gray-900 max-w-4xl w-full max-h-[80vh] p-8 rounded-2xl shadow-2xl border border-gray-700 overflow-y-auto text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-blue-500 mb-4">{modalArticle.title}</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap mb-6">
              {modalArticle.body}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {modalArticle.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setModalArticle(null)}
                className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
