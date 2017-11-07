import express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (_req, res, _next) => {
  res.send("index");
});

export default router;
