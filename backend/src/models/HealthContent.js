// models/HealthContent.js
const mongoose= require('mongoose');

const healthContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  ageRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  gender: { type: String, enum: ['male', 'female', 'other', 'any'], default: 'any' },
  tags: [String], // e.g., ['diabetes', 'heart', 'mental health']
  createdAt: { type: Date, default: Date.now },
});

module.exports=mongoose.model('HealthContent', healthContentSchema);
