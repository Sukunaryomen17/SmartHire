const express = require("express");

const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidatesByJob,
  updateCandidateStatus,
  rescreenCandidate,
} = require("../controllers/candidateController");

const router = express.Router();

// POST /api/candidates
router.post("/", createCandidate);

// GET /api/candidates
router.get("/", getAllCandidates);

// GET /api/candidates/job/:jobId
router.get("/job/:jobId", getCandidatesByJob);

// GET /api/candidates/:id
router.get("/:id", getCandidateById);

// PATCH /api/candidates/:id/status
router.patch("/:id/status", updateCandidateStatus);

// POST /api/candidates/:id/rescreen
router.post("/:id/rescreen", rescreenCandidate);

module.exports = router;