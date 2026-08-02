const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getPOSProducts,
} = require("../controllers/productController");

// Everyone can view products
router.get("/", verifyToken, getProducts);

// POS Products
router.get("/pos", verifyToken, getPOSProducts);

// Admin & Manager can add products
router.post(
  "/",
  verifyToken,
  authorize("super_admin", "manager"),
  addProduct
);

// Admin & Manager can update products
router.put(
  "/:id",
  verifyToken,
  authorize("super_admin", "manager"),
  updateProduct
);

// Only Admin can delete products
router.delete(
  "/:id",
  verifyToken,
  authorize("super_admin"),
  deleteProduct
);

module.exports = router;