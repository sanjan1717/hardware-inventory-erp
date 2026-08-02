const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addCustomer,
  getCustomers,
  getCustomerById,
  getCustomerBills,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

router.post("/", verifyToken, addCustomer);
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);
router.get("/:id/bills", verifyToken, getCustomerBills);

module.exports = router;