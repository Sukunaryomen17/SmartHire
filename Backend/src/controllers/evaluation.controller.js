const service = require("../services/evaluation.service");
exports.calculate = async (req, res, next) => { try { const data = await service.calculate(req.params.applicationId, req.body.resumeScore); res.json({ success: true, data }); } catch (e) { next(e); } };
exports.decision = async (req, res, next) => { try { const data = await service.setDecision(req.params.applicationId, req.body.decision); res.json({ success: true, data }); } catch (e) { next(e); } };
