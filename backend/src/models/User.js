const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor","admin"], default: "patient" },
   profilePicture: { type: String, default: "" },
   phone: { type: String, default: "" },
age: { type: Number, default: null },
gender: { type: String, default: "" },
conditions: [{ type: String, default: [] }],
bio: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
