const express = require("express");

const {
  uploadResume,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// POST /api/resumes/upload
router.post("/upload", upload.single("resume"), uploadResume);

// GET /api/resumes/:id
router.get("/:id", getResumeById);

// DELETE /api/resumes/:id
router.delete("/:id", deleteResume);

module.exports = router;