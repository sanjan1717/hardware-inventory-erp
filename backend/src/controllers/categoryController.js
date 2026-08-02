const pool = require("../config/db");

// ==========================
// GET ALL CATEGORIES
// GET /api/categories
// ==========================
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.category_name,
        c.gst_rate_id,
        g.gst_name,
        g.gst_rate
      FROM categories c
      JOIN gst_rates g
        ON c.gst_rate_id = g.id
      WHERE c.is_active = true
      ORDER BY c.category_name;
    `);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ==========================
// CREATE CATEGORY
// POST /api/categories
// ==========================
const createCategory = async (req, res) => {
  try {
    const { category_name, gst_rate_id } = req.body;

    if (!category_name || !gst_rate_id) {
      return res.status(400).json({
        success: false,
        message: "Category name and GST are required",
      });
    }

    const exists = await pool.query(
      "SELECT * FROM categories WHERE LOWER(category_name) = LOWER($1)",
      [category_name]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (category_name, gst_rate_id)
       VALUES ($1, $2)
       RETURNING *`,
      [category_name, gst_rate_id]
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error creating category:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ==========================
// EXPORTS
// ==========================
module.exports = {
  getCategories,
  createCategory,
};