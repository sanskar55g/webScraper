const express = require("express");
const { scrapeWebsite } = require("../controllers/scraperController");

const router = express.Router();

router.post("/", scrapeWebsite);

module.exports = router;
