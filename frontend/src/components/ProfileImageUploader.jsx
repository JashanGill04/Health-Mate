import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import { Camera} from "lucide-react"

export default function ProfileImageUploader() {
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageBaseURL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/uploads/"
  : "https://health-mate-hs63.onrender.com/uploads/";

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        setProfileImage(res.data.profilePicture || "");
      } catch (err) {
        console.error("Failed to load profile image:", err);
      }
    };
    fetchImage();
  }, []);

  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    setUploading(true);
    try {
      const res = await axiosInstance.patch("/auth/upload-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileImage(res.data.profilePicture);
      toast.success("Profile image updated!");
      setImageFile(null);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Profile Picture</label>
      {profileImage && (
        <div className="w-full flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border">
          <img
            src={`${imageBaseURL}${profileImage}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        </div>
        
      )}

     <div className="flex justify-center gap-2"> 
     <div className="relative mt-2">
  <label
    htmlFor="fileInput"
    className="inline-flex items-center gap-2 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
  >
    <Camera />
  </label>
  <input
    id="fileInput"
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
    className="hidden"
  />
  {imageFile && (
    <p className="text-sm text-gray-600 mt-1 truncate">
      Selected: {imageFile.name}
    </p>
  )}
</div>

      <button
        type="button"
        disabled={!imageFile || uploading}
        onClick={handleUpload}
        className="bg-indigo-600 h-12 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
</div>
    </div>
  );
}
