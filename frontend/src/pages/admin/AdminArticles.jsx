import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { useAuthStore } from "../../contexts/AuthStore";
import { useNavigate } from "react-router-dom";

export default function AdminArticles() {

const { logout } = useAuthStore();
const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    gender: "",
    ageMin: "",
    ageMax: "",
  });
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);


const handleLogout = async () => {
  try {
    await logout(); // Clears auth state + calls /auth/logout
    navigate("/");
  } catch (error) {
    console.error("Logout failed", error);
  }
};





  const fetchArticles = async () => {
    try {
      const res = await axiosInstance.get("/admin/articles");
      setArticles(res.data);
    } catch (err) {
      console.error("Error fetching articles", err);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article._id);
    setFormData({
      title: article.title,
      content: article.body || article.content,
      tags: article.tags.join(", "),
      gender: article.gender || "",
      ageMin: article.ageRange?.min || "",
      ageMax: article.ageRange?.max || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/admin/articles/${editingArticle}`, {
        title: formData.title,
        body: formData.content,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        gender: formData.gender,
        ageRange: {
          min: parseInt(formData.ageMin),
          max: parseInt(formData.ageMax),
        },
      });
      setEditingArticle(null);
      fetchArticles();
    } catch (err) {
      console.error("Error updating article", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axiosInstance.delete(`/admin/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error("Error deleting article", err);
    }
  };

 const handleCreate = async () => {
  const ageMin = parseInt(formData.ageMin);
  const ageMax = parseInt(formData.ageMax);

  if (!formData.title || !formData.content || isNaN(ageMin) || isNaN(ageMax)) {
    alert("Please fill in all required fields with valid values.");
    return;
  }

  try {
    await axiosInstance.post("/admin/articles", {
      title: formData.title,
      body: formData.content,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      gender: formData.gender || "any",
      ageRange: {
        min: ageMin,
        max: ageMax,
      },
    });

    // Reset and refetch
    setFormData({
      title: "",
      content: "",
      tags: "",
      gender: "",
      ageMin: "",
      ageMax: "",
    });
    setAddingNew(false);
    fetchArticles();
  } catch (err) {
    console.error("Error creating article", err);
  }
};


  return (
    <div className="min-h-screen w-screen bg-slate-900 py-10 px-6 text-white">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="bg-blue-950 text-white py-5 px-6 rounded-xl shadow-xl mb-10">
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-3xl font-bold">🛠 Admin Article Management</h2>
      <p className="text-slate-300 mt-1">Edit, delete or add health articles</p>
    </div>
   <button
  onClick={handleLogout}
  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg"
>
  🔒 Logout
</button>

  </div>
</div>


        <div className="mb-8 text-right">
          <button
            onClick={() => setAddingNew(!addingNew)}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg font-medium text-white"
          >
            {addingNew ? "Cancel" : "➕ Add New Article"}
          </button>
        </div>

        {addingNew && (
          <div className="bg-slate-800 p-6 rounded-xl mb-10 border border-blue-800">
            <h3 className="text-xl font-semibold mb-4">New Article</h3>
            <input
              className="bg-slate-700 text-white border border-slate-600 p-3 w-full mb-3 rounded-md"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="bg-slate-700 text-white border border-slate-600 p-3 w-full mb-3 rounded-md"
              rows="5"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Content"
            />
            <input
              className="bg-slate-700 text-white border border-slate-600 p-3 w-full mb-3 rounded-md"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Tags (comma separated)"
            />
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <select
                className="bg-slate-700 text-white border border-slate-600 p-3 rounded-md w-full"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
<option value="any">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="number"
                className="bg-slate-700 text-white border border-slate-600 p-3 rounded-md w-full"
                value={formData.ageMin}
                onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                placeholder="Age Min"
              />
              <input
                type="number"
                className="bg-slate-700 text-white border border-slate-600 p-3 rounded-md w-full"
                value={formData.ageMax}
                onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                placeholder="Age Max"
              />
            </div>
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-md font-medium"
            >
              ✅ Create Article
            </button>
          </div>
        )}

        {articles.map((article) => (
          <div
            key={article._id}
            className={`rounded-xl shadow-md mb-8 p-6 border border-blue-800 bg-slate-800`}
          >
            {editingArticle === article._id ? (
              <>
                <input
                  className="bg-slate-700 text-white border border-slate-600 p-3 w-full mb-3 rounded-md"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Title"
                />
                <textarea
                  className="bg-slate-700 text-white border border-slate-600 p-3 w-full mb-3 rounded-md"
                  rows="5"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Content"
                />
                <input
                  className="bg-slate-700 text-white border border-slate-600 p-3 w-full mb-3 rounded-md"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Tags"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="bg-slate-700 text-white border border-slate-600 p-3 w-full rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Age Min"
                    value={formData.ageMin}
                    onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                    className="bg-slate-700 text-white border border-slate-600 p-3 w-full rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Age Max"
                    value={formData.ageMax}
                    onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                    className="bg-slate-700 text-white border border-slate-600 p-3 w-full rounded-md"
                  />
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingArticle(null)}
                    className="text-gray-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-white">{article.title}</h3>
                <p className="text-gray-300 mt-3 whitespace-pre-wrap">{article.body}</p>
                <div className="text-sm text-gray-400 mt-2">
                  <strong>Tags:</strong> {article.tags.join(", ")}
                  <br />
                  <strong>Gender:</strong> {article.gender || "N/A"}
                  <br />
                  <strong>Age Range:</strong> {article.ageRange?.min}–{article.ageRange?.max}
                </div>
                <div className="flex gap-6 mt-4">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-blue-400 hover:text-blue-200 font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
