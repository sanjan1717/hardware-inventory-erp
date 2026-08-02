import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import API from "../services/api";

import { DataGrid } from "@mui/x-data-grid";

const CustomerDetails = () => {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
const [bills, setBills] = useState([]);
const billColumns = [
  {
  field: "bill_number",
  headerName: "Invoice No",
  minWidth: 280,
  flex: 2,
},
  {
    field: "grand_total",
    headerName: "Total",
    width: 130,
    renderCell: (params) => `₹${params.value}`,
  },
  {
    field: "payment_method",
    headerName: "Payment",
    width: 140,
  },
  {
    field: "payment_status",
    headerName: "Status",
    width: 130,
  },
  {
    field: "actions",
    headerName: "Action",
    width: 130,
    renderCell: (params) => (
      <Button
        size="small"
        variant="outlined"
        onClick={() => alert(params.row.bill_number)}
      >
        View
      </Button>
    ),
  },
];
  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
  try {
    const customerRes = await API.get(`/customers/${id}`);
    setCustomer(customerRes.data.customer);

    const billsRes = await API.get(`/customers/${id}/bills`);
    setBills(billsRes.data.bills);

  } catch (err) {
    console.error(err);
  }
};

 return (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Customer Details
    </Typography>

    {customer && (
      <>
        <Typography>
          <strong>Name:</strong> {customer.customer_name}
        </Typography>

        <Typography>
          <strong>Phone:</strong> {customer.phone}
        </Typography>

        <Typography>
          <strong>Email:</strong> {customer.email}
        </Typography>

        <Typography>
          <strong>Address:</strong> {customer.address}
        </Typography>

        <Typography>
          <strong>GST Number:</strong> {customer.gst_number}
        </Typography>
        <Box
  sx={{
    display: "flex",
    gap: 4,
    mt: 3,
    mb: 2,
  }}
>
  <Typography>
    <strong>Total Bills:</strong> {bills.length}
  </Typography>

  <Typography>
    <strong>Total Purchase:</strong> ₹
    {bills.reduce(
      (sum, bill) => sum + Number(bill.grand_total),
      0
    )}
  </Typography>
</Box>
        <Typography
  variant="h5"
  sx={{ mt: 4, mb: 2 }}
>
  Billing History
</Typography>

{bills.length === 0 ? (
  <Typography>No bills found.</Typography>
) : (
  <Paper
    sx={{
      mt: 2,
      height: 450,
      width: "100%",
    }}
  >
    <DataGrid
      rows={bills}
      columns={billColumns}
      pageSizeOptions={[5, 10]}
      disableRowSelectionOnClick
    />
  </Paper>
)}

      </>
    )}
  </Box>
);
};

export default CustomerDetails;