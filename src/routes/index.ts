import express = require("express");
import { get } from "../controllers/indexController";

const router = express.Router();

/* GET home page. */
router.get("/", get);

export default router;
