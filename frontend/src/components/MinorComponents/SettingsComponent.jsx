import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { toast } from "react-hot-toast";
import ProfileImageUploader from "../ProfileImageUploader";
import Modal from "../Modal";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../contexts/AuthStore";

const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Thyroid",
  "Depression"
];

const SettingsComponent = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bio: "",
    conditions: [],
    customCondition: "",
  });

  const [showSettings, setShowSettings] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        const { name, email, phone, age, gender, bio, conditions } = res.data;
        setForm({
          name: name || "",
          email: email || "",
          phone: phone || "",
          age: age || "",
          gender: gender || "",
          bio: bio || "",
          conditions: conditions || [],
          customCondition: "",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axiosInstance.patch("/auth/update", form);
      toast.success("Profile updated successfully!");
      setShowSettings(false);
    } catch (err) {
      toast.error("Failed to update profile. Try again.");
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      await checkAuth();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleCondition = (condition) => {
    setForm((prev) => {
      const updated = new Set(prev.conditions);
      updated.has(condition) ? updated.delete(condition) : updated.add(condition);
      return { ...prev, conditions: Array.from(updated) };
    });
  };

  return (
    <div>
     <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
  {/* Settings Button */}
  <button
    onClick={() => setShowSettings(true)}
    className="flex items-center gap-2 px-4 py-2 bg-sky-800 hover:bg-sky-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all duration-150"
  >
    <Settings size={16} /> Settings
  </button>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all duration-150"
  >
    <LogOut size={16} /> Logout
  </button>
</div>


{showSettings && (
  <div className="fixed inset-0 backdrop-blur-md z-40 transition-all"></div>
)}


      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
<div className="max-h-[80vh] overflow-y-auto pr-2 bg-[#1e293b] border border-slate-600 shadow-xl p-4 rounded-xl text-white">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded-md placeholder-gray-400"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded-md placeholder-gray-400"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded-md placeholder-gray-400"
            />
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Age"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded-md placeholder-gray-400"
              min="0"
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded-md text-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Bio"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded-md placeholder-gray-400"
              rows={4}
            />

            <div>
              <p className="text-sm font-medium mb-2">Medical Conditions:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonConditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleCondition(condition)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      form.conditions.includes(condition)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-gray-300 border-slate-500 hover:bg-slate-600"
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom condition..."
                  className="flex-grow bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md placeholder-gray-400"
                  value={form.customCondition || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, customCondition: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = (form.customCondition || "").trim();
                    if (
                      trimmed &&
                      !form.conditions.includes(trimmed) &&
                      !commonConditions.includes(trimmed)
                    ) {
                      setForm((prev) => ({
                        ...prev,
                        conditions: [...prev.conditions, trimmed],
                        customCondition: "",
                      }));
                    }
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            <ProfileImageUploader />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsComponent;
