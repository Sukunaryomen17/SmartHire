const candidateService = require("../services/candidate.service");

const createCandidate = async (req, res) => {
  try {
    const {
      name, email, phone, location, education, experienceYears,
      skills, projects, profileSummary, appliedJobId,
    } = req.body;

    if (!name || !email || !appliedJobId) {
      return res.status(400).json({ success: false, message: "Name, email and appliedJobId are required." });
    }

    const candidate = await candidateService.createCandidate({
      name,
      email,
      phone: phone || "",
      location: location || "",
      education: education || "",
      experienceYears: Number(experienceYears) || 0,
      skills: Array.isArray(skills) ? skills : String(skills || "").split(",").map((s) => s.trim()).filter(Boolean),
      projects: Array.isArray(projects) ? projects : String(projects || "").split("\n").map((s) => s.trim()).filter(Boolean),
      profileSummary: profileSummary || "",
      appliedJobId,
    });

    res.status(201).json({ success: true, message: "Candidate application submitted successfully.", candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create candidate.", error: error.message });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await candidateService.getAllCandidates();
    res.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch candidates.", error: error.message });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const candidate = await candidateService.getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found." });
    res.json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch candidate.", error: error.message });
  }
};

const getCandidatesByJob = async (req, res) => {
  try {
    const candidates = await candidateService.getCandidatesByJob(req.params.jobId);
    res.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch job candidates.", error: error.message });
  }
};

const updateCandidateStatus = async (req, res) => {
  try {
    const { screeningStatus } = req.body;
    if (!["pending", "shortlisted", "rejected"].includes(screeningStatus)) {
      return res.status(400).json({ success: false, message: "Invalid screening status." });
    }
    const candidate = await candidateService.updateCandidateStatus(req.params.id, screeningStatus);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found." });
    res.json({ success: true, message: "Candidate status updated.", candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update candidate status.", error: error.message });
  }
};

const rescreenCandidate = async (req, res) => {
  try {
    const candidate = await candidateService.rescreenCandidate(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found." });
    res.json({ success: true, message: "Candidate rescreened successfully.", candidate });
  } catch (error) {
    res.status(502).json({ success: false, message: "FastAPI screening failed.", error: error.message });
  }
};

module.exports = { createCandidate, getAllCandidates, getCandidateById, getCandidatesByJob, updateCandidateStatus, rescreenCandidate };
