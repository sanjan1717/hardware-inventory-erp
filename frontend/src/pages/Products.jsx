import { useEffect, useState } from "react";
import API from "../services/api";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";

export default function Products() {
 const [products, setProducts] = useState([]);
const [search, setSearch] = useState("");
const [open, setOpen] = useState(false);
const [isEdit, setIsEdit] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [gstRates, setGstRates] = useState([]);
const [categories, setCategories] = useState([]);
const [formData, setFormData] = useState({
  name: "",
  sku: "",
  barcode: "",
  unit: "",
  purchase_price: "",
  selling_price: "",
  quantity: "",
  min_stock: "",
  category_id: "",
 gst_rate_id: "",
  hsn_code: "",
});

 useEffect(() => {
  fetchProducts();
  fetchGstRates();
  fetchCategories();
}, []);
const fetchProducts = async () => {
  try {
    const res = await API.get("/products");

    setProducts(res.data.products);
  } catch (err) {
    console.error(err);
  }
};
const fetchGstRates = async () => {
  try {
    const response = await API.get("/gst");

    setGstRates(response.data.data);
  } catch (error) {
    console.error("Error fetching GST rates:", error);
  }
};
const fetchCategories = async () => {
  try {
    const response = await API.get("/categories");
    setCategories(response.data.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const handleSave = async () => {
  try {
   if (isEdit) {
  await API.put(`/products/${selectedId}`, formData);
} else {
  await API.post("/products", formData);
}

    fetchProducts();

    setOpen(false);
setIsEdit(false);
setSelectedId(null);
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      unit: "",
      purchase_price: "",
      selling_price: "",
      quantity: "",
      min_stock: "",
      category_id:"",
      gst_rate_id: "",
      hsn_code: "",
    });

  } catch (err) {
    console.error(err);
   alert(err.response?.data?.message || "Failed to add product");
  }
};

const handleEdit = (product) => {
  setIsEdit(true);
  setSelectedId(product.id);

  setFormData({
  name: product.name,
  sku: product.sku,
  barcode: product.barcode,
  unit: product.unit,
  purchase_price: product.purchase_price,
  selling_price: product.selling_price,
  quantity: product.quantity,
  min_stock: product.min_stock,
  category_id: product.category_id || "",
  gst_rate_id: product.gst_rate_id || "",
});

  setOpen(true);
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/products/${id}`);

    fetchProducts();

    alert("Product deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete product");
  }
};


const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "name",
    headerName: "Product Name",
    flex: 2,
    minWidth: 250,
  },
  {
    field: "sku",
    headerName: "SKU",
    width: 140,
  },
  {
    field: "selling_price",
    headerName: "Price (₹)",
    width: 140,
    valueFormatter: (value) => `₹${value}`,
  },
  {
  field: "quantity",
  headerName: "Stock Status",
  width: 180,

  renderCell: (params) => {
    const qty = params.row.quantity;
    const min = params.row.min_stock;

    if (qty === 0) {
      return <Chip label="Out of Stock" color="error" />;
    }

    if (qty <= min) {
      return <Chip label="Low Stock" color="warning" />;
    }

    return <Chip label="In Stock" color="success" />;
  },
},
{
  field: "actions",
  headerName: "Actions",
  width: 140,
  sortable: false,

  renderCell: (params) => (
    <>
      <Tooltip title="Edit">
  <IconButton
    color="primary"
    onClick={() => handleEdit(params.row)}
  >
    <EditIcon />
  </IconButton>
</Tooltip>

      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  ),
}
];
const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase()) ||
  product.sku.toLowerCase().includes(search.toLowerCase()) ||
  (product.barcode || "").toLowerCase().includes(search.toLowerCase())
);

  return (
    <Box>
      {/* Header */}
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
    Products
  </Typography>

  <TextField
    size="small"
    placeholder="Search products..."
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
      name: "",
      sku: "",
      barcode: "",
      unit: "",
      purchase_price: "",
      selling_price: "",
      quantity: "",
      min_stock: "",
      category_id:"",
      gst_rate_id: "",
      hsn_code: "",
    });

    setOpen(true);
  }}
>
  Add Product
</Button>
</Box>
      {/* Table */}
     <Paper
  sx={{
    height: 550,
    width: "100%",
    overflow: "hidden",
  }}

>
        <DataGrid
  rows={filteredProducts}
  columns={columns}
  pageSizeOptions={[10, 20, 50,100]}
  disableRowSelectionOnClick
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
      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
  {isEdit ? "Edit Product" : "Add Product"}
</DialogTitle>

  <DialogContent>

    <TextField
      margin="dense"
      label="Product Name"
      fullWidth
      value={formData.name}
      onChange={(e) =>
        setFormData({
          ...formData,
          name: e.target.value,
        })
      }
    />

    <TextField
      margin="dense"
      label="SKU"
      fullWidth
      value={formData.sku}
      onChange={(e) =>
        setFormData({
          ...formData,
          sku: e.target.value,
        })
      }
    />
<TextField
  margin="dense"
  label="Barcode"
  fullWidth
  value={formData.barcode}
  onChange={(e) =>
    setFormData({ ...formData, barcode: e.target.value })
  }
/>

<TextField
  margin="dense"
  label="Unit"
  fullWidth
  value={formData.unit}
  onChange={(e) =>
    setFormData({ ...formData, unit: e.target.value })
  }
/>

<TextField
  margin="dense"
  label="Purchase Price"
  type="number"
  fullWidth
  value={formData.purchase_price}
  onChange={(e) =>
    setFormData({
      ...formData,
      purchase_price: e.target.value,
    })
  }
/>

<TextField
  margin="dense"
  label="Selling Price"
  type="number"
  fullWidth
  value={formData.selling_price}
  onChange={(e) =>
    setFormData({
      ...formData,
      selling_price: e.target.value,
    })
  }
/>

<TextField
  margin="dense"
  label="Quantity"
  type="number"
  fullWidth
  value={formData.quantity}
  onChange={(e) =>
    setFormData({
      ...formData,
      quantity: e.target.value,
    })
  }
/>

<TextField
  margin="dense"
  label="Minimum Stock"
  type="number"
  fullWidth
  value={formData.min_stock}
  onChange={(e) =>
    setFormData({
      ...formData,
      min_stock: e.target.value,
    })
  }
  
/>
<TextField
  margin="dense"
  label="Category"
  select
  fullWidth
  value={formData.category_id || ""}
  onChange={(e) => {
    const selectedCategory = categories.find(
      (cat) => cat.id === Number(e.target.value)
    );

    setFormData({
      ...formData,
      category_id: e.target.value,
      gst_rate_id: selectedCategory?.gst_rate_id || "",
    });
  }}
>
  {categories.map((category) => (
    <MenuItem key={category.id} value={category.id}>
      {category.category_name}
    </MenuItem>
  ))}
</TextField>
<TextField
  margin="dense"
  label="GST"
  fullWidth
  value={
    gstRates.find(
      (gst) => gst.id === Number(formData.gst_rate_id)
    )?.gst_name || ""
  }
  InputProps={{
    readOnly: true,
  }}
/>
  </DialogContent>

  <DialogActions>

    <Button onClick={() => setOpen(false)}>
      Cancel
    </Button>

   <Button
  variant="contained"
  onClick={handleSave}
>
  {isEdit ? "Update" : "Save"}
</Button>

  </DialogActions>
</Dialog>
    </Box>
  );
}
