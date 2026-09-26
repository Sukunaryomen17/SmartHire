const service = require("../services/interview.service");

exports.schedule = async (req, res, next) => {
  try {
    const data = await service.schedule({
      ...req.body,
      applicationId: req.params.applicationId
    });

    res.status(201).json({
      success: true,
      data
    });
  } catch (e) {
    next(e);
  }
};

exports.getByApplication = async (req, res, next) => {
  try {
    const data = await service.getByApplication(
      req.params.applicationId
    );

    res.json({
      success: true,
      data
    });
  } catch (e) {
    next(e);
  }
};

exports.evaluate = async (req, res, next) => {
  try {
    const data = await service.evaluate(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data
    });
  } catch (e) {
    next(e);
  }
};