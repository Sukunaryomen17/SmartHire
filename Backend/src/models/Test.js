const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  options: { type: [String], required: true, validate: v => v.length >= 2 },
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1, min: 0 }
});

const testSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  title: { type: String, required: true, trim: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  questions: { type: [questionSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
