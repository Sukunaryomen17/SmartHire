const router = require("express").Router();
const c = require("../controllers/test.controller");
router.post("/job/:jobId", c.create);
router.get("/:id", c.get);
router.post("/:testId/start", c.start);
router.post("/attempt/:attemptId/submit", c.submit);
module.exports = router;
