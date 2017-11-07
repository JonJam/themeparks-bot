import express = require("express");

// TODO Sort out tslint disables

const router = express.Router();

/* GET users listing. */
// tslint:disable:variable-name
router.get("/", (_req, res) => {
  res.send("respond with a resource");
});

export default router;
