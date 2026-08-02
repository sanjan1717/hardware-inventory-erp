const pool = require("../config/db");

// =========================
// Get All Stores
// =========================
const getStores = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM stores
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      stores: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Add Store
// =========================
const addStore = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      phone,
      email,
      gst_number,
      logo_path,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO stores
      (
        name,
        code,
        address,
        phone,
        email,
        gst_number,
        logo_path
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        name,
        code,
        address,
        phone,
        email,
        gst_number,
        logo_path || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Store added successfully",
      store: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Update Store
// =========================
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      code,
      address,
      phone,
      email,
      gst_number,
      logo_path,
    } = req.body;

    const result = await pool.query(
      `UPDATE stores
       SET
         name=$1,
         code=$2,
         address=$3,
         phone=$4,
         email=$5,
         gst_number=$6,
         logo_path=$7
       WHERE id=$8
       RETURNING *`,
      [
        name,
        code,
        address,
        phone,
        email,
        gst_number,
        logo_path,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.json({
      success: true,
      message: "Store updated",
      store: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Delete Store
// =========================
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM stores
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.json({
      success: true,
      message: "Store deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getStores,
  addStore,
  updateStore,
  deleteStore,
};