const jobService =
  require("../services/job.service");

/*
 * POST /api/jobs
 */
const createJob =
  async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        requirements,
        skills,
        experienceRequired,
        educationRequired,
        location,
        employmentType,
        createdBy,
      } = req.body;

      if (
        !title ||
        !company ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, company and description are required.",
        });
      }

      const job =
        await jobService.createJob({
          title,
          company,
          description,
          requirements:
            requirements || [],
          skills: skills || [],
          experienceRequired:
            experienceRequired || 0,
          educationRequired:
            educationRequired || "",
          location:
            location || "",
          employmentType:
            employmentType ||
            "full-time",
          createdBy:
            createdBy || "",
        });

      res.status(201).json({
        success: true,
        message:
          "Job created successfully.",
        job,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to create job.",
        error: error.message,
      });
    }
  };

/*
 * GET /api/jobs
 */
const getAllJobs =
  async (req, res) => {
    try {
      const jobs =
        await jobService.getAllJobs();

      res.json({
        success: true,
        count: jobs.length,
        jobs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch jobs.",
        error: error.message,
      });
    }
  };

/*
 * GET /api/jobs/:id
 */
const getJobById =
  async (req, res) => {
    try {
      const job =
        await jobService.getJobById(
          req.params.id
        );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      res.json({
        success: true,
        job,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch job.",
        error: error.message,
      });
    }
  };

/*
 * PUT /api/jobs/:id
 */
const updateJob =
  async (req, res) => {
    try {
      const job =
        await jobService.updateJob(
          req.params.id,
          req.body
        );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Job updated successfully.",
        job,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update job.",
        error: error.message,
      });
    }
  };

/*
 * DELETE /api/jobs/:id
 */
const deleteJob =
  async (req, res) => {
    try {
      const job =
        await jobService.deleteJob(
          req.params.id
        );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Job deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to delete job.",
        error: error.message,
      });
    }
  };

/*
 * PATCH /api/jobs/:id/status
 */
const updateJobStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      if (
        ![
          "draft",
          "open",
          "closed",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid job status.",
        });
      }

      const job =
        await jobService.updateJobStatus(
          req.params.id,
          status
        );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Job status updated.",
        job,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update job status.",
        error: error.message,
      });
    }
  };

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
};