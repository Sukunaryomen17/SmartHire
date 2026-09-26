const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true, default: "SmartHire" },
    description: { type: String, required: true, trim: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    mustHave: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    experienceRequired: { type: Number, default: 0, min: 0 },
    educationRequired: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time",
    },
    threshold: { type: Number, default: 70, min: 0, max: 100 },
    resumeWeight: { type: Number, default: 65, min: 0, max: 100 },
    qaWeight: { type: Number, default: 35, min: 0, max: 100 },
    confidenceCutoff: { type: Number, default: 70, min: 0, max: 100 },
    status: { type: String, enum: ["draft", "open", "closed"], default: "open" },
    createdBy: { type: String, default: "" },
    aiAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
