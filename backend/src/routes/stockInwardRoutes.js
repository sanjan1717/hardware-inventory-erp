const express = require("express");

const {
  addStock,
  getStockHistory,
} = require("../controllers/stockInwardController");

const router = express.Router();

// Add stock
router.post("/", addStock);

// Stock history
router.get("/", getStockHistory);

module.exports = router;