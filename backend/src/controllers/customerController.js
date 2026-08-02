const pool = require("../config/db");

const addCustomer = async (req, res) => {
  try {
    const { customer_name, phone, email, address, gst_number } = req.body;
    const store_id = req.user.store_id;

    const result = await pool.query(
      `INSERT INTO customers
      (store_id, customer_name, phone, email, address, gst_number)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        store_id,
        customer_name,
        phone,
        email,
        address,
        gst_number,
      ]
    );

    res.status(201).json({
      success: true,
      customer: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getCustomers = async (req, res) => {
  try {
    const store_id = req.user.store_id;

    const result = await pool.query(
      `SELECT *
       FROM customers
       WHERE store_id = $1
       ORDER BY customer_name ASC`,
      [store_id]
    );

    res.json({
      success: true,
      customers: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const {
      customer_name,
      phone,
      email,
      address,
      gst_number,
    } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET
         customer_name = $1,
         phone = $2,
         email = $3,
         address = $4,
         gst_number = $5
       WHERE id = $6
       AND store_id = $7
       RETURNING *`,
      [
        customer_name,
        phone,
        email,
        address,
        gst_number,
        id,
        store_id,
      ]
    );

    res.json({
      success: true,
      customer: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    await pool.query(
      `DELETE FROM customers
       WHERE id = $1
       AND store_id = $2`,
      [id, store_id]
    );

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });

  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete customer because billing records exist.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const result = await pool.query(
      `SELECT * FROM customers
       WHERE id = $1 AND store_id = $2`,
      [id, store_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getCustomerBills = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const result = await pool.query(
      `SELECT id,
              bill_number,
              grand_total,
              payment_status,
              payment_method
       FROM bills
       WHERE customer_id = $1
         AND store_id = $2
       ORDER BY id DESC`,
      [id, store_id]
    );

    res.json({
      success: true,
      bills: result.rows,
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
  addCustomer,
  getCustomers,
  getCustomerById,
  getCustomerBills,
  updateCustomer,
  deleteCustomer,
};