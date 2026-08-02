const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.getDashboardStats);
router.get("/low-stock", dashboardController.getLowStockProducts);
router.get("/recent-bills", dashboardController.getRecentBills);

module.exports = router;