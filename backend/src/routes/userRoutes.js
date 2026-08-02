const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// ======================================
// Get Logged-in User Profile
// ======================================
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to your profile!",
    user: req.user,
  });
});

// ======================================
// Get All Users
// ======================================
router.get(
  "/",
  verifyToken,
  authorize("super_admin", "manager"),
  getUsers
);

// ======================================
// Create User
// ======================================
router.post(
  "/",
  verifyToken,
  authorize("super_admin"),
  addUser
);

// ======================================
// Update User
// ======================================
router.put(
  "/:id",
  verifyToken,
  authorize("super_admin"),
  updateUser
);

// ======================================
// Delete User
// ======================================
router.delete(
  "/:id",
  verifyToken,
  authorize("super_admin"),
  deleteUser
);

module.exports = router;