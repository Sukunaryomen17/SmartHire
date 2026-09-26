const axios = require("axios");
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");

const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

const buildProfileText = (candidate) => [
  `Name: ${candidate.name}`,
  `Location: ${candidate.location || "Not specified"}`,
  `Education: ${candidate.education || "Not specified"}`,
  `Experience: ${candidate.experienceYears || 0} years`,
  `Skills: ${(candidate.skills || []).join(", ") || "Not specified"}`,
  `Projects: ${(candidate.projects || []).join("; ") || "Not specified"}`,
  `Profile summary: ${candidate.profileSummary || "Not specified"}`,
].join("\n");

const jobToMLDescription = (job) => ({
  title: job.title,
  must_have: job.mustHave?.length ? job.mustHave : (job.requirements || []),
  nice_to_have: job.niceToHave?.length ? job.niceToHave : [],
  experience_years: job.experienceRequired || 0,
  education: job.educationRequired || "",
  location: job.location || "",
  summary: job.description || "",
});

const screenCandidateWithAI = async (job, candidate) => {
  try {
    const response = await axios.post(
      `${FASTAPI_URL}/api/llm/resume-match`,
      {
        candidate_id: candidate._id.toString(),
        jd_id: job._id.toString(),
        job_description: jobToMLDescription(job),
        resume: candidate.profileText || buildProfileText(candidate),
      },
      { timeout: 180000 }
    );
    return response.data;
  } catch (error) {
    console.error("FastAPI screening failed:", error.message);
    if (error.response) console.error("FastAPI response:", error.response.data);
    throw new Error("FastAPI candidate screening failed");
  }
};

const applyScreeningResult = (candidate, job, aiResult) => {
  candidate.screeningResult = aiResult;
  candidate.resumeScore = aiResult.score ?? null;
  candidate.matchedSkills = aiResult.matched_skills || aiResult.matchedSkills || [];
  candidate.missingSkills = aiResult.gaps || aiResult.missingSkills || [];
  const threshold = Number(job.threshold ?? 70);
  candidate.screeningStatus = candidate.resumeScore !== null && candidate.resumeScore >= threshold
    ? "shortlisted"
    : "rejected";
  candidate.screeningError = "";
};

const createCandidate = async (candidateData) => {
  const candidate = await Candidate.create(candidateData);
  candidate.profileText = buildProfileText(candidate);

  const job = await Job.findById(candidate.appliedJobId);
  if (!job) throw new Error("Job not found");

  try {
    const aiResult = await screenCandidateWithAI(job, candidate);
    applyScreeningResult(candidate, job, aiResult);
  } catch (error) {
    candidate.screeningStatus = "pending";
    candidate.screeningError = error.message;
  }

  await candidate.save();
  return candidate;
};

const getAllCandidates = async () => Candidate.find()
  .populate("appliedJobId")
  .sort({ createdAt: -1 });

const getCandidateById = async (id) => Candidate.findById(id).populate("appliedJobId");

const getCandidatesByJob = async (jobId) => Candidate.find({ appliedJobId: jobId })
  .populate("appliedJobId")
  .sort({ resumeScore: -1, createdAt: -1 });

const updateCandidateStatus = async (id, screeningStatus) => Candidate.findByIdAndUpdate(
  id, { screeningStatus }, { new: true, runValidators: true }
);

const rescreenCandidate = async (candidateId) => {
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) return null;
  const job = await Job.findById(candidate.appliedJobId);
  if (!job) throw new Error("Job not found");

  candidate.profileText = buildProfileText(candidate);
  const aiResult = await screenCandidateWithAI(job, candidate);
  applyScreeningResult(candidate, job, aiResult);
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
