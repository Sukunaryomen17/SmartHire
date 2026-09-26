const service = require("../services/test.service");
exports.create = async (req, res, next) => { try { const test = await service.createTest({ ...req.body, jobId: req.params.jobId }); res.status(201).json({ success: true, data: test }); } catch (e) { next(e); } };
exports.get = async (req, res, next) => { try { const test = await service.getTest(req.params.id); if (!test) return res.status(404).json({ success: false, message: "Test not found" }); res.json({ success: true, data: test }); } catch (e) { next(e); } };
exports.start = async (req, res, next) => { try { const data = await service.startAttempt(req.params.testId, req.body.applicationId); res.status(201).json({ success: true, data }); } catch (e) { next(e); } };
exports.submit = async (req, res, next) => { try { const data = await service.submitAttempt(req.params.attemptId, req.body.answers); res.json({ success: true, data }); } catch (e) { next(e); } };
