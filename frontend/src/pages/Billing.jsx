import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import API from "../services/api";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductSearch from "../components/ProductSearch";
import PaymentSuccessDialog from "../dialogs/PaymentSuccessDialog";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InvoicePreviewDialog from "../dialogs/InvoicePreviewDialog";
function Billing() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
const [customers, setCustomers] = useState([]);
const [paymentLoading, setPaymentLoading] = useState(false);
const [search, setSearch] = useState("");
const [previewOpen, setPreviewOpen] = useState(false);
const formatCurrency = (amount) => {
  return Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
const API_BASE = "https://hardware-inventory-erp.onrender.com";
const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});
const [cart, setCart] = useState([]);
const [paymentMethod, setPaymentMethod] = useState("CASH");
const [successOpen, setSuccessOpen] = useState(false);

const [invoiceNo, setInvoiceNo] = useState("");
const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
const invoiceUrl = `${API_BASE}${bill.data.invoice_url}`;
const [customerForm, setCustomerForm] = useState({
  customer_name: "",
  phone: "",
  email: "",
  address: "",
  gst_number: "",
});
const [invoiceUrl, setInvoiceUrl] = useState("");
useEffect(() => {
  fetchCustomers();
  
}, []);

const fetchCustomers = async () => {
  try {
    const res = await API.get("/customers");

    console.log("Full Response:", res.data);
    console.log("Customers:", res.data.customers);
    console.log("Is Array?", Array.isArray(res.data.customers));

    setCustomers(res.data.customers);
  } catch (err) {
    console.error(err);
  }
};

const addToCart = (product) => {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    setCart(
      cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  } else {
  setCart([
    ...cart,
    {
      ...product,
      gst_percent: Number(product.gst_rate),
      quantity: 1,
    },
  ]);
}
  setSearch("");
};

const increaseQuantity = (id) => {
  setCart(
    cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
};


const decreaseQuantity = (id) => {
  setCart(
    cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};
const subtotal = cart.reduce(
  (sum, item) => sum + item.quantity * Number(item.selling_price),
  0
);

const gstTotal = cart.reduce(
  (sum, item) => {
    const lineTotal = item.quantity * Number(item.selling_price);
    return sum + (lineTotal * Number(item.gst_percent || 0)) / 100;
  },
  0
);

const discount = 0;

const grandTotal = subtotal + gstTotal - discount;

const removeFromCart = (id) => {
  setCart(cart.filter((item) => item.id !== id));
};
const billData = {
  customer_id: selectedCustomer || null,
  payment_method: paymentMethod,
  items: cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    price: item.selling_price,
    gst_percent: item.gst_percent,
  })),
  subtotal,
  gst: gstTotal,
  discount,
  grand_total: grandTotal,
};
const generateBill = async () => {
   
   try {
      const res = await API.post("/bills", billData);
      setInvoiceNo(res.data.bill_number);

setInvoiceUrl(
  `https://hardware-inventory-erp.onrender.com${res.data.invoice_url}`
);

setSuccessOpen(true);

      console.log("Bill Created:", res.data);

      setSnackbar({
  open: true,
  message: "Bill created successfully",
  severity: "success",
});

      setCart([]);
      setSearch("");
      setSelectedCustomer("");

   } catch (err) {
      console.error(err);

     setSnackbar({
  open: true,
  message: err.response?.data?.message || "Failed",
  severity: "error",
});
   }
};
const handlePayment = async () => {
  try {
    setPaymentLoading(true);

    // Create Razorpay Order
    const { data: order } = await API.post("/payment/create-order", {
      amount: grandTotal,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Hardware Inventory ERP",
      description: "Invoice Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          // Verify Payment
          const verify = await API.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verify.data.success) {
            throw new Error("Payment verification failed");
          }

          // Create Bill
          const bill = await API.post("/bills", billData);

          // Save invoice details
          setInvoiceNo(bill.data.bill_number);

          setInvoiceUrl(
            `https://hardware-inventory-erp.onrender.com${bill.data.invoice_url}`
          );

          // Show Success Dialog
          setSuccessOpen(true);

          // Clear billing screen
          setCart([]);
          setSelectedCustomer("");
          setSearch("");

          setSnackbar({
            open: true,
            message: "Payment Successful",
            severity: "success",
          });

        } catch (err) {
          console.error("Payment Handler Error:", err);

          setSnackbar({
            open: true,
            message:
              err.response?.data?.message ||
              err.message ||
              "Payment failed",
            severity: "error",
          });
        } finally {
          setPaymentLoading(false);
        }
      },

      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        },
      },

      theme: {
        color: "#1976d2",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (err) {
    console.error(err);

    setPaymentLoading(false);

    setSnackbar({
      open: true,
      message:
        err.response?.data?.message ||
        "Unable to initiate payment",
      severity: "error",
    });
  }
};
const handleCreateCustomer = async () => {
  try {
    const res = await API.post("/customers", customerForm);

    // Refresh customer list
    await fetchCustomers();

    // Automatically select the new customer
    setSelectedCustomer(res.data.customer.id);

    // Reset form
    setCustomerForm({
      customer_name: "",
      phone: "",
      email: "",
      address: "",
      gst_number: "",
    });

    // Close dialog
    setOpenCustomerDialog(false);

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to add customer");
  }
};
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Create New Bill
      </Typography>

     <Grid container spacing={3} alignItems="flex-start">
        {/* Customer Information */}
        <Grid item xs={12} md={4}>                      
        <Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 3,
    minHeight: 170,
  }}
>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>Select Customer</InputLabel>

                  <Select
                    value={selectedCustomer}
                    label="Select Customer"
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                   <MenuItem value="">
  Walk-in Customer
</MenuItem>

{Array.isArray(customers) &&
  customers.map((customer) => (
  <MenuItem
    key={customer.id}
    value={customer.id}
  >
    {customer.customer_name}
  </MenuItem>
))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
  fullWidth
  variant="contained"
  onClick={() => setOpenCustomerDialog(true)}
>
  + New Customer
</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

       {/* Product Selection */}
<Grid item xs={12} md={4}>
  <Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 3,
  }}
>
    <Typography variant="h6" gutterBottom>
      Product Selection
    </Typography>

    <ProductSearch
  onAddProduct={addToCart}
/>
  </Paper>
</Grid>

        {/* Shopping Cart */}
<Grid item xs={12}>
  <Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 3,
    minHeight:420,
  }}
>
    <Typography variant="h6" gutterBottom>
      Shopping Cart
    </Typography>

    {cart.length === 0 ? (
      <Typography color="text.secondary">
        No products added.
      </Typography>
    ) : (
    <TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><b>Product</b></TableCell>
        <TableCell align="center"><b>Qty</b></TableCell>
        <TableCell align="right"><b>Price/Item</b></TableCell>
        <TableCell align="center"><b>GST</b></TableCell>
        <TableCell align="right"><b>Total Price</b></TableCell>
        <TableCell align="center"><b>Actions</b></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {cart.map((item) => (
        <TableRow key={item.id}>
          {/* Product */}
          <TableCell>{item.name}</TableCell>

          {/* Quantity */}
          <TableCell align="center">
            {item.quantity}
          </TableCell>

          {/* Price Per Item */}
          <TableCell align="right">
            ₹{formatCurrency(item.selling_price)}
          </TableCell>

          {/* GST */}
          <TableCell align="center">
            {item.gst_percent}%
          </TableCell>

          {/* Total Price */}
          <TableCell align="right">
            ₹{formatCurrency(
  item.quantity *
  Number(item.selling_price) *
  (1 + Number(item.gst_percent) / 100)
)}
          </TableCell>

          {/* Actions */}
          <TableCell align="center">
            <Stack direction="row" spacing={1} justifyContent="center">
              <IconButton
                size="small"
                onClick={() => decreaseQuantity(item.id)}
              >
                <RemoveIcon />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => increaseQuantity(item.id)}
              >
                <AddIcon />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => removeFromCart(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    )}
  </Paper>
</Grid>

      {/* Payment Summary */}
<Grid item xs={12} md={4}>
  <Paper
  sx={{
    p: 3,
    borderRadius: 3,
    position: "sticky",
    top: 20,
  }}
>
    <Typography
      variant="h4"
      fontWeight="bold"
      align="center"
      gutterBottom
    >
      ₹{formatCurrency(grandTotal)}
    </Typography>

    <Typography
      variant="subtitle1"
      align="center"
      color="text.secondary"
      sx={{ mb: 2 }}
    >
      Grand Total
    </Typography>
    <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel>Payment Method</InputLabel>

  <Select
    value={paymentMethod}
    label="Payment Method"
    onChange={(e) => setPaymentMethod(e.target.value)}
  >
    <MenuItem value="CASH">Cash</MenuItem>
    <MenuItem value="UPI">UPI</MenuItem>
    <MenuItem value="CARD">Card</MenuItem>
    <MenuItem value="BANK">Bank Transfer</MenuItem>
  </Select>
</FormControl>

  
  <Button
  fullWidth
  variant="contained"
  size="large"
  disabled={paymentLoading}
  onClick={() => {
  if (paymentMethod === "CASH" || paymentMethod === "BANK") {
    generateBill();
  } else {
    handlePayment();
  }
}}
  sx={{
    height: 56,
    fontWeight: 700,
    borderRadius: 3,
  }}
>
  {paymentLoading ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    "Proceed to Payment"
  )}
</Button>
    <Typography sx={{ mb: 1 }}>
      <strong>Subtotal:</strong> ₹{formatCurrency(subtotal)}
    </Typography>

    <Typography sx={{ mb: 1 }}>
      <strong>GST:</strong> ₹{formatCurrency(gstTotal)}
    </Typography>

    <Typography sx={{ mb: 2 }}>
      <strong>Discount:</strong> ₹{formatCurrency(discount)}
    </Typography>

    <Divider sx={{ my: 2 }} />

    <Typography
  variant="h5"
  fontWeight="bold"
  sx={{
    display: "flex",
    justifyContent: "space-between",
  }}
>
      <span>Total</span>
      <span>₹{formatCurrency(grandTotal)}</span>
    </Typography>
  </Paper>
</Grid>
</Grid>
<PaymentSuccessDialog
  open={successOpen}
  onClose={() => setSuccessOpen(false)}
  onPreview={() => {
    setSuccessOpen(false);
    setPreviewOpen(true);
  }}
  invoiceNo={invoiceNo}
  invoiceUrl={invoiceUrl}
/>

<InvoicePreviewDialog
  open={previewOpen}
  onClose={() => {
    setPreviewOpen(false);

    // Reset billing screen
    setCart([]);
    setSelectedCustomer("");
    setSearch("");
    setInvoiceNo("");
    setInvoiceUrl("");
  }}
  invoiceUrl={invoiceUrl}
  invoiceNo={invoiceNo}
/>
<Dialog
  open={openCustomerDialog}
  onClose={() => setOpenCustomerDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Add New Customer</DialogTitle>

  <DialogContent>

    <TextField
      margin="dense"
      fullWidth
      label="Customer Name"
      value={customerForm.customer_name}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          customer_name: e.target.value,
        })
      }
    />

    <TextField
      margin="dense"
      fullWidth
      label="Phone"
      value={customerForm.phone}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          phone: e.target.value,
        })
      }
    />

    <TextField
      margin="dense"
      fullWidth
      label="Email"
      value={customerForm.email || ""}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          email: e.target.value,
        })
      }
    />

    <TextField
      margin="dense"
      fullWidth
      multiline
      rows={3}
      label="Address"
      value={customerForm.address}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          address: e.target.value,
        })
      }
    />

    <TextField
      margin="dense"
      fullWidth
      label="GST Number (Optional)"
      value={customerForm.gst_number || ""}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          gst_number: e.target.value,
        })
      }
    />

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() => setOpenCustomerDialog(false)}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleCreateCustomer}
    >
      Save Customer
    </Button>

  </DialogActions>

</Dialog>
<Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() =>
    setSnackbar({ ...snackbar, open: false })
  }
>
  <Alert
    severity={snackbar.severity}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
</Box>
);
}

export default Billing;