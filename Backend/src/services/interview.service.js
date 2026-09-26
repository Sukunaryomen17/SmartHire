const Interview = require("../models/Interview");

exports.schedule = (data) => Interview.create(data);
exports.evaluate = async (id, data) => {
  const interview = await Interview.findById(id);
  if (!interview) throw Object.assign(new Error("Interview not found"), { status: 404 });
  for (const key of ["technicalScore", "problemSolvingScore", "communicationScore", "behavioralScore"]) {
    const value = Number(data[key]);
    if (!Number.isFinite(value) || value < 0 || value > 100) throw Object.assign(new Error(`${key} must be between 0 and 100`), { status: 400 });
    interview[key] = value;
  }
  interview.feedback = data.feedback || "";
  interview.status = "COMPLETED";
  interview.evaluatedAt = new Date();
  await interview.save();
  return interview;
};
