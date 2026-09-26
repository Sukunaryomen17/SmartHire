const router = require("express").Router();
const c = require("../controllers/interview.controller");
router.post("/application/:applicationId", c.schedule);
router.post("/:id/evaluate", c.evaluate);
module.exports = router;
