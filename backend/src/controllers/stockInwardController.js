const pool = require("../config/db");

// Add Stock
const addStock = async (req, res) => {
  try {
    const { product_id, quantity, supplier_name, remarks } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product and Quantity are required",
      });
    }

    // Check product exists
    const productResult = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Save stock inward history
    await pool.query(
      `INSERT INTO stock_inward
      (product_id, quantity, supplier_name, remarks)
      VALUES ($1,$2,$3,$4)`,
      [product_id, quantity, supplier_name, remarks]
    );

    // Increase product quantity
    await pool.query(
      `UPDATE products
       SET quantity = quantity + $1
       WHERE id = $2`,
      [quantity, product_id]
    );

    res.json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// View Stock History
const getStockHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        si.id,
        p.name,
        p.barcode,
        si.quantity,
        si.supplier_name,
        si.remarks,
        si.created_at
      FROM stock_inward si
      JOIN products p
      ON si.product_id = p.id
      ORDER BY si.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addStock,
  getStockHistory,
};