const Evaluation = require("../models/Evaluation");
const TestAttempt = require("../models/TestAttempt");
const Interview = require("../models/Interview");

exports.calculate = async (applicationId, resumeScore, weights = { resume: 0.3, test: 0.3, interview: 0.4 }) => {
  const attempt = await TestAttempt.findOne({ applicationId, status: "SUBMITTED" }).sort({ submittedAt: -1 });
  const interview = await Interview.findOne({ applicationId, status: "COMPLETED" }).sort({ evaluatedAt: -1 });
  if (resumeScore == null || !attempt || attempt.maxScore == null || attempt.maxScore === 0 || !interview) {
    throw Object.assign(new Error("Resume, test, and interview scores are all required before final calculation"), { status: 400 });
  }
  const testScore = (attempt.score / attempt.maxScore) * 100;
  const interviewScore = (interview.technicalScore + interview.problemSolvingScore + interview.communicationScore + interview.behavioralScore) / 4;
  const finalScore = Number((resumeScore * weights.resume + testScore * weights.test + interviewScore * weights.interview).toFixed(2));
  return Evaluation.findOneAndUpdate(
    { applicationId },
    { $set: { resumeScore, testScore: Number(testScore.toFixed(2)), interviewScore: Number(interviewScore.toFixed(2)), finalScore, calculatedAt: new Date() }, $setOnInsert: { decision: "PENDING" } },
    { new: true, upsert: true, runValidators: true }
  );
};

exports.setDecision = async (applicationId, decision) => {
  if (!["SELECTED", "REJECTED"].includes(decision)) throw Object.assign(new Error("decision must be SELECTED or REJECTED"), { status: 400 });
  const evaluation = await Evaluation.findOne({ applicationId });
  if (!evaluation || evaluation.finalScore == null) throw Object.assign(new Error("Calculate the final evaluation first"), { status: 400 });
  evaluation.decision = decision;
  return evaluation.save();
};
