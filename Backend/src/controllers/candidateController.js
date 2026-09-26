const candidateService =
  require("../services/candidate.service");

/*
 * POST /api/candidates
 */
const createCandidate =
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        resumeId,
        appliedJobId,
      } = req.body;

      if (
        !name ||
        !email ||
        !appliedJobId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and appliedJobId are required.",
        });
      }

      const candidate =
        await candidateService.createCandidate({
          name,
          email,
          phone: phone || "",
          resumeId:
            resumeId || null,
          appliedJobId,
        });

      res.status(201).json({
        success: true,
        message:
          "Candidate created successfully.",
        candidate,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to create candidate.",
        error: error.message,
      });
    }
  };

/*
 * GET /api/candidates
 */
const getAllCandidates =
  async (req, res) => {
    try {
      const candidates =
        await candidateService.getAllCandidates();

      res.json({
        success: true,
        count: candidates.length,
        candidates,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch candidates.",
        error: error.message,
      });
    }
  };

/*
 * GET /api/candidates/:id
 */
const getCandidateById =
  async (req, res) => {
    try {
      const candidate =
        await candidateService.getCandidateById(
          req.params.id
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found.",
        });
      }

      res.json({
        success: true,
        candidate,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch candidate.",
        error: error.message,
      });
    }
  };

/*
 * GET /api/candidates/job/:jobId
 */
const getCandidatesByJob =
  async (req, res) => {
    try {
      const candidates =
        await candidateService.getCandidatesByJob(
          req.params.jobId
        );

      res.json({
        success: true,
        count: candidates.length,
        candidates,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch job candidates.",
        error: error.message,
      });
    }
  };

/*
 * PATCH /api/candidates/:id/status
 */
const updateCandidateStatus =
  async (req, res) => {
    try {
      const {
        screeningStatus,
      } = req.body;

      const allowedStatuses = [
        "pending",
        "shortlisted",
        "rejected",
      ];

      if (
        !allowedStatuses.includes(
          screeningStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid screening status.",
        });
      }

      const candidate =
        await candidateService.updateCandidateStatus(
          req.params.id,
          screeningStatus
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Candidate status updated.",
        candidate,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update candidate status.",
        error: error.message,
      });
    }
  };

/*
 * POST /api/candidates/:id/rescreen
 */
const rescreenCandidate =
  async (req, res) => {
    try {
      const candidate =
        await candidateService.rescreenCandidate(
          req.params.id
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Candidate rescreened successfully.",
        candidate,
      });
    } catch (error) {
      res.status(502).json({
        success: false,
        message:
          "FastAPI screening failed.",
        error: error.message,
      });
    }
  };

module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidatesByJob,
  updateCandidateStatus,
  rescreenCandidate,
};