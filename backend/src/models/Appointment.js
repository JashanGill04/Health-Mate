const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "DoctorProfile" },
  date: String,
  time: String,
  reason: { type: String, default: "" }, // 👈 new field
  status: { type: String, enum: ["pending", "accepted" , "rejected" , "completed"], default: "pending" },

},{timestamps:true});

module.exports = mongoose.model("Appointment", appointmentSchema);
