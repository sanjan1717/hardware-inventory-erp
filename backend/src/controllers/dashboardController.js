const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total Products
    const products = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    // Total Customers
    const customers = await pool.query(
      "SELECT COUNT(*) FROM customers"
    );

    // Low Stock
   const lowStock = await pool.query(
  "SELECT COUNT(*) FROM products WHERE quantity <= min_stock"
);
    // Today's Sales
    const sales = await pool.query(`
      SELECT COALESCE(SUM(grand_total),0) AS total
      FROM bills
      WHERE DATE(created_at)=CURRENT_DATE
    `);

    res.json({
      todaySales: sales.rows[0].total,
      products: products.rows[0].count,
      customers: customers.rows[0].count,
      lowStock: lowStock.rows[0].count,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};
exports.getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        sku,
        quantity,
        min_stock
      FROM products
      WHERE quantity <= min_stock
      ORDER BY quantity ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.getRecentBills = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.bill_number,
        c.customer_name,
        b.grand_total,
        b.payment_status,
        b.created_at
      FROM bills b
      INNER JOIN customers c
        ON b.customer_id = c.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

    
exports.getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        sku,
        quantity,
        min_stock
      FROM products
      WHERE quantity <= min_stock
      ORDER BY quantity ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};