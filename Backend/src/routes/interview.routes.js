const router = require("express").Router();

const c = require("../controllers/interview.controller");

router.post(
  "/application/:applicationId",
  c.schedule
);

router.get(
  "/application/:applicationId",
  c.getByApplication
);

router.post(
  "/:id/evaluate",
  c.evaluate
);

module.exports = router;