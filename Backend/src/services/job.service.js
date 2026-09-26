const Job = require("../models/Job");
const axios = require("axios");

const FASTAPI_URL =
  process.env.FASTAPI_URL ||
  "http://127.0.0.1:8000";

/*
 * Call FastAPI to analyze the Job Description.
 */
const analyzeJobWithAI = async (job) => {
  try {
    const response = await axios.post(
      `${FASTAPI_URL}/api/v1/analyze-jd`,
      {
        jobId: job._id.toString(),

        title: job.title,

        company: job.company,

        description: job.description,

        requirements: job.requirements,

        skills: job.skills,

        experienceRequired:
          job.experienceRequired,

        educationRequired:
          job.educationRequired,

        location: job.location,

        employmentType:
          job.employmentType,
      },
      {
        timeout: 120000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "FastAPI JD analysis failed:",
      error.message
    );

    throw new Error(
      "FastAPI JD analysis failed"
    );
  }
};

/*
 * Create a job.
 */
const createJob = async (jobData) => {
  const job = await Job.create(jobData);

  /*
   * AI analysis is separate from normal
   * database creation.
   */
  try {
    const aiResult =
      await analyzeJobWithAI(job);

    job.aiAnalysis = aiResult;

    await job.save();
  } catch (error) {
    console.error(
      "AI JD analysis unavailable:",
      error.message
    );

    /*
     * We don't delete the job if FastAPI
     * is temporarily unavailable.
     */
  }

  return job;
};

/*
 * Get all jobs.
 */
const getAllJobs = async () => {
  return await Job.find().sort({
    createdAt: -1,
  });
};

/*
 * Get one job.
 */
const getJobById = async (id) => {
  return await Job.findById(id);
};

/*
 * Update job.
 */
const updateJob = async (id, data) => {
  return await Job.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

/*
 * Delete job.
 */
const deleteJob = async (id) => {
  return await Job.findByIdAndDelete(id);
};

/*
 * Change status.
 */
const updateJobStatus = async (
  id,
  status
) => {
  return await Job.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  analyzeJobWithAI,
};