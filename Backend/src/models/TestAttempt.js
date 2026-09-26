const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: { type: String, default: "" },
  isCorrect: { type: Boolean, default: false },
  awardedPoints: { type: Number, default: 0 }
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true, index: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: null },
  answers: { type: [answerSchema], default: [] },
  score: { type: Number, default: null },
  maxScore: { type: Number, default: null },
  status: { type: String, enum: ["IN_PROGRESS", "SUBMITTED", "EXPIRED"], default: "IN_PROGRESS" }
}, { timestamps: true });

module.exports = mongoose.model("TestAttempt", attemptSchema);
