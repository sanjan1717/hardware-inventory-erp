const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Register
const register = async (req, res) => {
  try {
    const { full_name, email, password, role, store_id } = req.body;

    if (!full_name || !email || !password || !role || !store_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
      (store_id, full_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)`,
      [store_id, full_name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        store_id: user.store_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

   res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    store_id: user.store_id
  }
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  register,
  login
};