import express = require("express");

// TODO Sort out tslint disables

const router = express.Router();

/* GET home page. */
// tslint:disable:variable-name
router.get("/", (_req, res) => {
  res.send("index");
});

export default router;
