const Job = require("../models/Job");

const createJob = async (jobData) => Job.create(jobData);
const getAllJobs = async () => Job.find().sort({ createdAt: -1 });
const getJobById = async (id) => Job.findById(id);
const updateJob = async (id, data) => Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteJob = async (id) => Job.findByIdAndDelete(id);
const updateJobStatus = async (id, status) => Job.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, updateJobStatus };
