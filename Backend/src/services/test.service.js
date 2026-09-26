const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");

exports.createTest = async (data) => Test.create(data);

exports.getTest = async (id) => {
  const test = await Test.findById(id).lean();
  if (!test) return null;
  test.questions = (test.questions || []).map(({ correctAnswer, ...q }) => q);
  return test;
};

exports.startAttempt = async (testId, applicationId) => {
  const test = await Test.findById(testId);
  if (!test) throw Object.assign(new Error("Test not found"), { status: 404 });
  const existing = await TestAttempt.findOne({ testId, applicationId, status: "IN_PROGRESS" });
  if (existing) return existing;
  return TestAttempt.create({ testId, applicationId, maxScore: test.questions.reduce((s, q) => s + q.points, 0) });
};

exports.submitAttempt = async (attemptId, answers) => {
  const attempt = await TestAttempt.findById(attemptId);
  if (!attempt) throw Object.assign(new Error("Attempt not found"), { status: 404 });
  if (attempt.status !== "IN_PROGRESS") throw Object.assign(new Error("Attempt is not in progress"), { status: 400 });
  const test = await Test.findById(attempt.testId);
  if (!test) throw Object.assign(new Error("Test not found"), { status: 404 });
  const deadline = new Date(attempt.startedAt.getTime() + test.durationMinutes * 60000);
  if (new Date() > deadline) {
    attempt.status = "EXPIRED";
    attempt.submittedAt = new Date();
    await attempt.save();
    throw Object.assign(new Error("Test time has expired"), { status: 400 });
  }
  const submitted = new Map((answers || []).map(a => [String(a.questionId), String(a.answer ?? "")]));
  let score = 0;
  attempt.answers = test.questions.map(q => {
    const answer = submitted.get(String(q._id)) || "";
    const isCorrect = answer.trim() === q.correctAnswer.trim();
    const awardedPoints = isCorrect ? q.points : 0;
    score += awardedPoints;
    return { questionId: q._id, answer, isCorrect, awardedPoints };
  });
  attempt.score = score;
  attempt.maxScore = test.questions.reduce((s, q) => s + q.points, 0);
  attempt.status = "SUBMITTED";
  attempt.submittedAt = new Date();
  await attempt.save();
  return attempt;
};
