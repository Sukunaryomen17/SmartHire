const router = require("express").Router();
const c = require("../controllers/evaluation.controller");
router.post("/application/:applicationId/calculate", c.calculate);
router.patch("/application/:applicationId/decision", c.decision);
module.exports = router;
