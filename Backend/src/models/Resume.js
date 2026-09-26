const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    // Data extracted by FastAPI
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Complete response from FastAPI
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    processingStatus: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "processed",
        "failed",
      ],
      default: "uploaded",
    },

    processingError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);