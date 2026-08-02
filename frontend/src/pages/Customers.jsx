import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

export default function Customers() {


  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  customer_name: "",
  phone: "",
  email: "",
  address: "",
  gst_number: "",
});
  useEffect(() => {
    fetchCustomers();
  }, []);

  

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data.customers);
    } catch (err) {
      console.error(err);
    }
};

const handleEdit = (customer) => {
  setIsEdit(true);
  setSelectedId(customer.id);

  setFormData({
    customer_name: customer.customer_name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address || "",
    gst_number: customer.gst_number || "",
  });


  setOpen(true);
};
  const handleSave = async () => {
  try {
    if (isEdit) {
      await API.put(`/customers/${selectedId}`, formData);
    } else {
      await API.post("/customers", formData);
    }

    fetchCustomers();
    setOpen(false);

    setFormData({
      customer_name: "",
      phone: "",
      email: "",
      address: "",
      gst_number: "",
    });

    setIsEdit(false);
    setSelectedId(null);

  } catch (err) {
    console.error(err);
    alert("Failed to save customer");
  }
};
const handleDelete = async (id) => {
  if (!window.confirm("Delete this customer?")) return;

  try {
    await API.delete(`/customers/${id}`);
    fetchCustomers();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
  const filteredCustomers = customers.filter((customer) =>
  customer.customer_name.toLowerCase().includes(search.toLowerCase()) ||
  (customer.phone || "").toLowerCase().includes(search.toLowerCase()) ||
  (customer.email || "").toLowerCase().includes(search.toLowerCase())
);

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "customer_name", headerName: "Customer Name", flex: 1 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "gst_number", headerName: "GST", width: 180 },
  {
  field: "actions",
  headerName: "Actions",
  width: 180,
  renderCell: (params) => (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={() => handleEdit(params.row)}
      >
        Edit
      </Button>

      <Button
        size="small"
        color="error"
        sx={{ ml: 1 }}
        onClick={() => handleDelete(params.row.id)}
      >
        Delete
      </Button>
    </>
  ),
}
];
  return (
  <Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Customers
      </Typography>

      <TextField
        size="small"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={() => {
    setIsEdit(false);
    setSelectedId(null);
    setFormData({
      customer_name: "",
      phone: "",
      email: "",
      address: "",
      gst_number: "",
    });
    setOpen(true);
  }}
>
  Add Customer
</Button>
    </Box>

<Paper
  sx={{
    height: 550,
    width: "100%",
    overflow: "hidden",
  }}
>
  <DataGrid
    rows={filteredCustomers}
    columns={columns}
    pageSizeOptions={[10, 20, 50]}
    disableRowSelectionOnClick
    onRowClick={(params) => navigate(`/customers/${params.row.id}`)}
    sx={{
      border: 0,
      width: "100%",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#F8FAFC",
        fontWeight: "bold",
        fontSize: 15,
      },
      "& .MuiDataGrid-cell": {
        fontSize: 14,
      },
    }}
  />
</Paper>
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>
    {isEdit ? "Edit Customer" : "Add Customer"}
  </DialogTitle>

  <DialogContent>
    <TextField
      fullWidth
      margin="normal"
      label="Customer Name"
      value={formData.customer_name}
      onChange={(e) =>
        setFormData({ ...formData, customer_name: e.target.value })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Phone"
      value={formData.phone}
      onChange={(e) =>
        setFormData({ ...formData, phone: e.target.value })
      }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Email"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
      
    />
    <TextField
  fullWidth
  margin="normal"
  label="Address"
  value={formData.address}
  onChange={(e) =>
    setFormData({ ...formData, address: e.target.value })
  }
/>

<TextField
  fullWidth
  margin="normal"
  label="GST Number"
  value={formData.gst_number}
  onChange={(e) =>
    setFormData({ ...formData, gst_number: e.target.value })
  }
/>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button
  variant="contained"
  onClick={handleSave}
>
  Save
</Button>
  </DialogActions>
</Dialog>
  </Box>
  
  );
}