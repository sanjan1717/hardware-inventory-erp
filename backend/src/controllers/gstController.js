const pool = require("../config/db");

// ============================================
// GET ALL ACTIVE GST RATES
// GET /api/gst
// ============================================
const getGstRates = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        gst_name,
        gst_rate
      FROM gst_rates
      WHERE is_active = true
      ORDER BY gst_rate ASC
      `
    );

    return res.status(200).json({
      success: true,
      message: "GST rates fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching GST rates:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch GST rates",
      error: error.message,
    });
  }
};

module.exports = {
  getGstRates,
};