const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    education: { type: String, default: "", trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    skills: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    profileSummary: { type: String, default: "", trim: true },
    profileText: { type: String, default: "" },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", default: null },
    appliedJobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    resumeScore: { type: Number, default: null, min: 0, max: 100 },
    screeningResult: { type: mongoose.Schema.Types.Mixed, default: null },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    screeningStatus: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
    screeningError: { type: String, default: "" },
    testScore: { type: Number, default: null },
    interviewScore: { type: Number, default: null },
    finalScore: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
