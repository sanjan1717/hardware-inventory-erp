const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ======================================
// Get Users
// ======================================
const getUsers = async (req, res) => {
  try {
    let query;
    let values = [];

    if (req.user.role === "super_admin") {
      query = `
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.role,
          u.store_id,
          u.is_active,
          u.created_at,
          s.name AS store_name
        FROM users u
        LEFT JOIN stores s ON u.store_id = s.id
        ORDER BY u.id ASC
      `;
    } else {
      query = `
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.role,
          u.store_id,
          u.is_active,
          u.created_at,
          s.name AS store_name
        FROM users u
        LEFT JOIN stores s ON u.store_id = s.id
        WHERE u.store_id = $1
        ORDER BY u.id ASC
      `;
      values = [req.user.store_id];
    }

    const result = await pool.query(query, values);

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Add User
// ======================================
const addUser = async (req, res) => {
  try {
    const {
  full_name,
  email,
  password,
  role,
  store_id,
} = req.body;

console.log("Request Body:", req.body);
console.log("Role received:", role);

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users
      (full_name, email, password, role, store_id, is_active)
      VALUES ($1,$2,$3,$4,$5,true)
      `,
      [
        full_name,
        email,
        hashedPassword,
        role,
        store_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    if (err.code === "23505") {
  return res.status(400).json({
    message: "Email already exists",
  });
}
    console.error("Add User Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Update User
// ======================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      email,
      role,
      store_id,
      is_active,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        full_name = $1,
        email = $2,
        role = $3,
        store_id = $4,
        is_active = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        full_name,
        email,
        role,
        store_id,
        is_active,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Delete User
// ======================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};