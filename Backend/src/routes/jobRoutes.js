const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
} = require("../controllers/jobController");

const router = express.Router();

// POST /api/jobs
router.post("/", createJob);

// GET /api/jobs
router.get("/", getAllJobs);

// GET /api/jobs/:id
router.get("/:id", getJobById);

// PUT /api/jobs/:id
router.put("/:id", updateJob);

// DELETE /api/jobs/:id
router.delete("/:id", deleteJob);

// PATCH /api/jobs/:id/status
router.patch("/:id/status", updateJobStatus);

module.exports = router;