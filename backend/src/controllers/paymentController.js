const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.json(order);
  } catch (err) {
    console.error("Create Order Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    console.log("✅ Payment Verified");

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("Verify Payment Error:", err);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};