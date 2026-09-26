const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const Resume = require("../models/Resume");

const FASTAPI_URL =
  process.env.FASTAPI_URL ||
  "http://127.0.0.1:8000";

/*
 * Send resume file to FastAPI.
 */
const analyzeResumeWithAI = async (
  resume
) => {
  try {
    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(
        resume.filePath
      )
    );

    formData.append(
      "resumeId",
      resume._id.toString()
    );

    const response =
      await axios.post(
        `${FASTAPI_URL}/api/v1/analyze-resume`,
        formData,
        {
          headers:
            formData.getHeaders(),

          timeout: 180000,

          maxContentLength:
            Infinity,

          maxBodyLength:
            Infinity,
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "FastAPI resume analysis failed:",
      error.message
    );

    if (error.response) {
      console.error(
        "FastAPI response:",
        error.response.data
      );
    }

    throw new Error(
      "FastAPI resume analysis failed"
    );
  }
};

/*
 * Upload and analyze resume.
 */
const uploadAndAnalyzeResume =
  async (file) => {
    const resume =
      await Resume.create({
        fileName:
          file.originalname,

        filePath:
          file.path,

        fileType:
          file.mimetype,

        fileSize:
          file.size,

        processingStatus:
          "processing",
      });

    try {
      const aiResult =
        await analyzeResumeWithAI(
          resume
        );

      resume.aiAnalysis =
        aiResult;

      /*
       * Expected FastAPI response:
       *
       * {
       *   parsedData: {...}
       * }
       */
      if (aiResult.parsedData) {
        resume.parsedData =
          aiResult.parsedData;
      }

      resume.processingStatus =
        "processed";

      resume.processingError = "";

      await resume.save();

      return resume;
    } catch (error) {
      resume.processingStatus =
        "failed";

      resume.processingError =
        error.message;

      await resume.save();

      throw error;
    }
  };

/*
 * Get resume.
 */
const getResumeById = async (id) => {
  return await Resume.findById(id);
};

/*
 * Delete resume.
 */
const deleteResume = async (id) => {
  const resume =
    await Resume.findById(id);

  if (!resume) {
    return null;
  }

  if (
    resume.filePath &&
    fs.existsSync(resume.filePath)
  ) {
    fs.unlinkSync(resume.filePath);
  }

  await Resume.findByIdAndDelete(id);

  return resume;
};

module.exports = {
  analyzeResumeWithAI,
  uploadAndAnalyzeResume,
  getResumeById,
  deleteResume,
};