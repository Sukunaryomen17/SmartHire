const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  type: { type: String, enum: ["TECHNICAL", "HR", "FINAL"], default: "TECHNICAL" },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ["SCHEDULED", "COMPLETED", "CANCELLED"], default: "SCHEDULED" },
  technicalScore: { type: Number, min: 0, max: 100, default: null },
  problemSolvingScore: { type: Number, min: 0, max: 100, default: null },
  communicationScore: { type: Number, min: 0, max: 100, default: null },
  behavioralScore: { type: Number, min: 0, max: 100, default: null },
  feedback: { type: String, default: "" },
  evaluatedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
