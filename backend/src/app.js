const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path"); // <-- ADD THIS
const customerRoutes = require("./routes/customerRoutes");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const billRoutes = require("./routes/billRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const gstRoutes = require("./routes/gstRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const stockInwardRoutes = require("./routes/stockInwardRoutes");
const app = express();
const storeRoutes = require("./routes/storeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
// Middleware
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Serve invoice PDFs
app.use("/invoices", express.static(path.join(__dirname, "../invoices")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/gst", gstRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stock-inward", stockInwardRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/payment", paymentRoutes);

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Hardware Inventory API is running successfully!"
    });
});

module.exports = app;