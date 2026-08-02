const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getStores,
  addStore,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");

// =========================
// Get All Stores
// Admin & Manager
// =========================
router.get(
  "/",
  verifyToken,
  authorize("super_admin", "manager"),
  getStores
);

// =========================
// Add Store
// Admin & Manager (Development)
// =========================
router.post(
  "/",
  verifyToken,
  authorize("super_admin", "manager"),
  addStore
);

// =========================
// Update Store
// Admin & Manager (Development)
// =========================
router.put(
  "/:id",
  verifyToken,
  authorize("super_admin", "manager"),
  updateStore
);

// =========================
// Delete Store
// Admin & Manager (Development)
// =========================
router.delete(
  "/:id",
  verifyToken,
  authorize("super_admin", "manager"),
  deleteStore
);

module.exports = router;