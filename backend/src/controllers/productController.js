const pool = require("../config/db");

// ==========================
// Add Product
// ==========================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      unit,
      purchase_price,
      selling_price,
      quantity,
      min_stock,
      category_id,
      gst_rate_id,
    } = req.body;

    const store_id = req.user.store_id;

    await pool.query(
      `INSERT INTO products
      (
        store_id,
        name,
        sku,
        barcode,
        unit,
        purchase_price,
        selling_price,
        quantity,
        min_stock,
        category_id,
        gst_rate_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        store_id,
        name,
        sku,
        barcode,
        unit,
        purchase_price,
        selling_price,
        quantity,
        min_stock,
        category_id,
        gst_rate_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
    });

  } catch (error) {
  console.error(error);

  if (error.code === "23505") {
    return res.status(400).json({
      success: false,
      message: "SKU already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Server Error",
  });
}
};

// ==========================
// Get Products
// ==========================
// ==========================
// Get Products
// ==========================
const getProducts = async (req, res) => {
  try {
    let result;

    if (req.user.role === "super_admin") {
      result = await pool.query(`
        SELECT
          p.*,
          c.category_name,
          g.gst_name,
          g.gst_rate,
          s.name AS store_name
        FROM products p
        LEFT JOIN categories c
          ON p.category_id = c.id
        LEFT JOIN gst_rates g
          ON p.gst_rate_id = g.id
        LEFT JOIN stores s
          ON p.store_id = s.id
        WHERE p.is_active = TRUE
ORDER BY p.id ASC
      `);
    } else {
      result = await pool.query(
        `
        SELECT
  p.*,
  c.category_name,
  g.gst_name,
  g.gst_rate,
  s.name AS store_name
FROM products p
LEFT JOIN categories c
  ON p.category_id = c.id
LEFT JOIN gst_rates g
  ON p.gst_rate_id = g.id
LEFT JOIN stores s
  ON p.store_id = s.id
WHERE p.store_id = $1
AND p.is_active = TRUE
ORDER BY p.id ASC
        `,
        [req.user.store_id]
      );
    }

    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Update Product
// ==========================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      sku,
      barcode,
      unit,
      purchase_price,
      selling_price,
      quantity,
      min_stock,
      category_id,
      gst_rate_id,
    } = req.body;

    const store_id = req.user.store_id;

    const result = await pool.query(
      `UPDATE products
       SET
         name = $1,
         sku = $2,
         barcode = $3,
         unit = $4,
         purchase_price = $5,
         selling_price = $6,
         quantity = $7,
         min_stock = $8,
         category_id = $9,
         gst_rate_id = $10,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       AND store_id = $12
       RETURNING *`,
      [
        name,
        sku,
        barcode,
        unit,
        purchase_price,
        selling_price,
        quantity,
        min_stock,
        category_id,
        gst_rate_id,
        id,
        store_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully!",
      product: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Delete Product
// ==========================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       AND store_id = $2
       RETURNING *`,
      [id, store_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getPOSProducts = async (req, res) => {
  try {
    let result;

    if (req.user.role === "super_admin") {
      result = await pool.query(`
        SELECT
          p.id,
          p.name,
          p.barcode,
          p.selling_price,
          p.quantity,
          p.store_id,
          s.name AS store_name,
          c.category_name,
          g.gst_rate,
          g.gst_name
        FROM products p
        LEFT JOIN stores s ON p.store_id = s.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN gst_rates g ON p.gst_rate_id = g.id
        WHERE p.is_active = true
        ORDER BY p.name
      `);
    } else {
      result = await pool.query(
        `
        SELECT
          p.id,
          p.name,
          p.barcode,
          p.selling_price,
          p.quantity,
          p.store_id,
          s.name AS store_name,
          c.category_name,
          g.gst_rate,
          g.gst_name
        FROM products p
        LEFT JOIN stores s ON p.store_id = s.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN gst_rates g ON p.gst_rate_id = g.id
        WHERE p.store_id = $1
        AND p.is_active = true
        ORDER BY p.name
        `,
        [req.user.store_id]
      );
    }

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch POS products",
    });
  }
};

// ==========================
// Export
// ==========================
module.exports = {
  addProduct,
  getProducts,
  getPOSProducts,
  updateProduct,
  deleteProduct,
};