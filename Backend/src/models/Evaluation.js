const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true },
  resumeScore: { type: Number, min: 0, max: 100, default: null },
  testScore: { type: Number, min: 0, max: 100, default: null },
  interviewScore: { type: Number, min: 0, max: 100, default: null },
  finalScore: { type: Number, min: 0, max: 100, default: null },
  decision: { type: String, enum: ["PENDING", "SELECTED", "REJECTED"], default: "PENDING" },
  calculatedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
