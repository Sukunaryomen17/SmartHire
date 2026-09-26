const resumeService =
  require("../services/resume.service");

/*
 * POST /api/resumes/upload
 */
const uploadResume =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload a resume file.",
        });
      }

      const resume =
        await resumeService.uploadAndAnalyzeResume(
          req.file
        );

      res.status(201).json({
        success: true,
        message:
          "Resume uploaded and analyzed successfully.",
        resume,
      });
    } catch (error) {
      console.error(error);

      res.status(502).json({
        success: false,
        message:
          "Resume upload or AI processing failed.",
        error: error.message,
      });
    }
  };

/*
 * GET /api/resumes/:id
 */
const getResumeById =
  async (req, res) => {
    try {
      const resume =
        await resumeService.getResumeById(
          req.params.id
        );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found.",
        });
      }

      res.json({
        success: true,
        resume,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch resume.",
        error: error.message,
      });
    }
  };

/*
 * DELETE /api/resumes/:id
 */
const deleteResume =
  async (req, res) => {
    try {
      const resume =
        await resumeService.deleteResume(
          req.params.id
        );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Resume deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to delete resume.",
        error: error.message,
      });
    }
  };

module.exports = {
  uploadResume,
  getResumeById,
  deleteResume,
};