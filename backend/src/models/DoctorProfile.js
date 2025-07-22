const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  specialization: String,
  availability: [{
    day: String,
    time: String
  }],
  contactInfo: String,
},{timestamps:true});

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);
