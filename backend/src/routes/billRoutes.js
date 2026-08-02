const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { createBill } = require("../controllers/billController");

router.post("/", verifyToken, createBill);

module.exports = router;