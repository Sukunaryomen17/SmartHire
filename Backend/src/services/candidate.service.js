const axios = require("axios");

const Candidate =
  require("../models/Candidate");

const Resume =
  require("../models/Resume");

const Job =
  require("../models/Job");

const FASTAPI_URL =
  process.env.FASTAPI_URL ||
  "http://127.0.0.1:8000";

/*
 * Send candidate + job + resume
 * to FastAPI for screening.
 */
const screenCandidateWithAI =
  async (job, resume) => {
    try {
      const response =
        await axios.post(
          `${FASTAPI_URL}/api/v1/screen-resume`,
          {
            jobId:
              job._id.toString(),

            resumeId:
              resume._id.toString(),

            job: {
              title: job.title,

              description:
                job.description,

              requirements:
                job.requirements,

              skills:
                job.skills,

              experienceRequired:
                job.experienceRequired,

              educationRequired:
                job.educationRequired,
            },

            resume: {
              parsedData:
                resume.parsedData,

              aiAnalysis:
                resume.aiAnalysis,
            },
          },
          {
            timeout: 180000,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "FastAPI screening failed:",
        error.message
      );

      if (error.response) {
        console.error(
          "FastAPI response:",
          error.response.data
        );
      }

      throw new Error(
        "FastAPI candidate screening failed"
      );
    }
  };

/*
 * Create candidate.
 */
const createCandidate =
  async (candidateData) => {
    const candidate =
      await Candidate.create(
        candidateData
      );

    /*
     * If resume exists,
     * automatically perform Score 1.
     */
    if (candidate.resumeId) {
      const resume =
        await Resume.findById(
          candidate.resumeId
        );

      const job =
        await Job.findById(
          candidate.appliedJobId
        );

      if (resume && job) {
        try {
          const aiResult =
            await screenCandidateWithAI(
              job,
              resume
            );

          candidate.screeningResult =
            aiResult;

          candidate.resumeScore =
            aiResult.score ??
            aiResult.overallScore ??
            aiResult.screeningScore ??
            null;

          candidate.matchedSkills =
            aiResult.matchedSkills ||
            [];

          candidate.missingSkills =
            aiResult.missingSkills ||
            [];

          candidate.screeningStatus =
            aiResult.screeningStatus ||
            "pending";

          await candidate.save();
        } catch (error) {
          console.error(
            "Initial screening failed:",
            error.message
          );
        }
      }
    }

    return candidate;
  };

/*
 * Get all candidates.
 */
const getAllCandidates =
  async () => {
    return await Candidate.find()
      .populate("appliedJobId")
      .populate("resumeId")
      .sort({
        createdAt: -1,
      });
  };

/*
 * Get candidate by ID.
 */
const getCandidateById =
  async (id) => {
    return await Candidate.findById(id)
      .populate("appliedJobId")
      .populate("resumeId");
  };

/*
 * Get candidates for a job.
 */
const getCandidatesByJob =
  async (jobId) => {
    return await Candidate.find({
      appliedJobId: jobId,
    })
      .populate("resumeId")
      .sort({
        resumeScore: -1,
      });
  };

/*
 * Update candidate status.
 */
const updateCandidateStatus =
  async (
    id,
    screeningStatus
  ) => {
    return await Candidate.findByIdAndUpdate(
      id,
      {
        screeningStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  };

/*
 * Run Score 1 again.
 */
const rescreenCandidate =
  async (candidateId) => {
    const candidate =
      await Candidate.findById(
        candidateId
      );

    if (!candidate) {
      return null;
    }

    const resume =
      await Resume.findById(
        candidate.resumeId
      );

    const job =
      await Job.findById(
        candidate.appliedJobId
      );

    if (!resume || !job) {
      throw new Error(
        "Resume or job not found"
      );
    }

    const aiResult =
      await screenCandidateWithAI(
        job,
        resume
      );

    candidate.screeningResult =
      aiResult;

    candidate.resumeScore =
      aiResult.score ??
      aiResult.overallScore ??
      aiResult.screeningScore ??
      null;

    candidate.matchedSkills =
      aiResult.matchedSkills ||
      [];

    candidate.missingSkills =
      aiResult.missingSkills ||
      [];

    candidate.screeningStatus =
      aiResult.screeningStatus ||
      "pending";

    await candidate.save();

    return candidate;
  };

module.exports = {
  screenCandidateWithAI,
  createCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidatesByJob,
  updateCandidateStatus,
  rescreenCandidate,
};