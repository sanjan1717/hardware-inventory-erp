const express = require("express");
const router = express.Router();

const { getGstRates } = require("../controllers/gstController");

router.get("/", getGstRates);

module.exports = router;