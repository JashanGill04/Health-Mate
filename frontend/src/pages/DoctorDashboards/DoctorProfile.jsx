// src/pages/doctor/DoctorProfile.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { toast } from "react-hot-toast";
import DoctorLayout from "../../layouts/DoctorLayout";
import { useAuthStore } from "../../contexts/AuthStore";

export default function DoctorProfile() {
  const {authUser} = useAuthStore();
  const [specialization, setSpecialization] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [availability, setAvailability] = useState([{ day: "", time: "" }]);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const res = await axiosInstance.get(`/doctors/user/${authUser._id}`);
      const profile = res.data.profile;
      if (profile) {
        setSpecialization(profile.specialization || "");
        setContactInfo(profile.contactInfo || "");
        setAvailability(profile.availability || [{ day: "", time: "" }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const addAvailabilityField = () => {
    setAvailability([...availability, { day: "", time: "" }]);
  };

  const removeAvailabilityField = (index) => {
    const updated = availability.filter((_, i) => i !== index);
    setAvailability(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch("/doctors/profile", {
        specialization,
        contactInfo,
        availability,
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to save profile");
      console.error(err);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto bg-base-100 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-white">🩺 Doctor Profile Setup</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block mb-1 font-medium">Specialization</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-base-200 border border-gray-300 rounded"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g., Cardiologist"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact Info</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-base-200 border border-gray-300 rounded"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Phone / Email / Address"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Availability</label>
            {availability.map((slot, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Day"
                  className="flex-1 px-3 py-2 bg-base-200 border border-gray-300 rounded"
                  value={slot.day}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "day", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Time"
                  className="flex-1 px-3 py-2 bg-base-200 border border-gray-300 rounded"
                  value={slot.time}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "time", e.target.value)
                  }
                />
                {availability.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAvailabilityField(index)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAvailabilityField}
              className="text-sm text-blue-400 hover:underline"
            >
              + Add More
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
          >
            Save Profile
          </button>
        </form>
      </div>
    </DoctorLayout>
  );
}
