const mongoose = require("mongoose");

const symptomLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symptoms: [String],
  painLevel: Number,
  note: String,
}, { timestamps: true });

module.exports = mongoose.model("SymptomLog", symptomLogSchema);
