const jobService = require("../services/job.service");

const toArray = (value) => {
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  return String(value || "").split(",").map((v) => v.trim()).filter(Boolean);
};

const parseExperience = (value) => {
  const match = String(value ?? "0").match(/[0-9]+(?:\.[0-9]+)?/);
  return match ? Number(match[0]) : 0;
};

const createJob = async (req, res) => {
  try {
    const {
      title, company, description, requirements, skills, mustHave, niceToHave,
      experienceRequired, experience, educationRequired, education, location,
      employmentType, createdBy, threshold, resumeWeight, qaWeight, confidenceCutoff,
    } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Job title is required." });

    const must = toArray(mustHave ?? requirements);
    const nice = toArray(niceToHave);
    const jobDescription = description || `${title} role requiring ${must.join(", ") || "relevant skills"}.`;

    const job = await jobService.createJob({
      title,
      company: company || "SmartHire",
      description: jobDescription,
      requirements: must,
      skills: [...new Set([...must, ...toArray(skills)])],
      mustHave: must,
      niceToHave: nice,
      experienceRequired: Number(experienceRequired ?? parseExperience(experience)),
      educationRequired: educationRequired || education || "",
      location: location || "",
      employmentType: employmentType || "full-time",
      createdBy: createdBy || "",
      threshold: Number(threshold ?? 70),
      resumeWeight: Number(resumeWeight ?? 65),
      qaWeight: Number(qaWeight ?? 35),
      confidenceCutoff: Number(confidenceCutoff ?? 70),
      status: req.body.status || "open",
    });

    res.status(201).json({ success: true, message: "Job created successfully.", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create job.", error: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try { const jobs = await jobService.getAllJobs(); res.json({ success: true, count: jobs.length, jobs }); }
  catch (error) { res.status(500).json({ success: false, message: "Failed to fetch jobs.", error: error.message }); }
};

const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, job });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to fetch job.", error: error.message }); }
};

const updateJob = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.mustHave !== undefined) data.mustHave = toArray(data.mustHave);
    if (data.niceToHave !== undefined) data.niceToHave = toArray(data.niceToHave);
    if (data.experience !== undefined && data.experienceRequired === undefined) data.experienceRequired = parseExperience(data.experience);
    const job = await jobService.updateJob(req.params.id, data);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, message: "Job updated successfully.", job });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to update job.", error: error.message }); }
};

const deleteJob = async (req, res) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, message: "Job deleted successfully." });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to delete job.", error: error.message }); }
};

const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["draft", "open", "closed"].includes(status)) return res.status(400).json({ success: false, message: "Invalid job status." });
    const job = await jobService.updateJobStatus(req.params.id, status);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, message: "Job status updated.", job });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to update job status.", error: error.message }); }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, updateJobStatus };
