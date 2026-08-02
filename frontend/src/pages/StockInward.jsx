// Placeholder generated starter.
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  InputAdornment,
  List,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";

export default function StockInward() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    loadProducts();
    loadHistory();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products/pos");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await API.get("/stock-inward");
      setHistory(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];

    const value = search.toLowerCase();

    return products.filter((product) =>
      product.name.toLowerCase().includes(value) ||
      (product.barcode || "").includes(search) ||
      (product.sku || "").toLowerCase().includes(value)
    );
  }, [products, search]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearch("");
  };
  const handleUpdateStock = async () => {
  if (!selectedProduct) {
    setSnackbar({
      open: true,
      severity: "error",
      message: "Please select a product",
    });
    return;
  }

  if (!quantity || Number(quantity) <= 0) {
    setSnackbar({
      open: true,
      severity: "error",
      message: "Enter a valid quantity",
    });
    return;
  }

  try {
    setLoading(true);

    await API.post("/stock-inward", {
      product_id: selectedProduct.id,
      quantity: Number(quantity),
      supplier_name: supplier,
      remarks,
    });

    setSnackbar({
      open: true,
      severity: "success",
      message: "Stock updated successfully",
    });

    // Reload Products
    const productRes = await API.get("/products/pos");
    const latestProducts = productRes.data.data || [];
    setProducts(latestProducts);

    // Refresh selected product stock
    const updatedProduct = latestProducts.find(
      (p) => p.id === selectedProduct.id
    );

    if (updatedProduct) {
      setSelectedProduct(updatedProduct);
    }

    // Reload Stock History
    const historyRes = await API.get("/stock-inward");
    setHistory(historyRes.data.data || []);

    // Clear fields
    setQuantity("");
    setSupplier("");
    setRemarks("");

  } catch (err) {
    console.error(err);

    setSnackbar({
      open: true,
      severity: "error",
      message: err.response?.data?.message || "Failed to update stock",
    });

  } finally {
    setLoading(false);
  }
};

const historyColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "name",
    headerName: "Product",
    flex: 1.5,
    minWidth: 220,
  },
  {
    field: "barcode",
    headerName: "Barcode",
    width: 180,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 120,
  },
  {
    field: "supplier_name",
    headerName: "Supplier",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "remarks",
    headerName: "Remarks",
    flex: 1,
    minWidth: 180,
  },
 {
  field: "created_at",
  headerName: "Date",
  width: 220,
  valueGetter: (value) => value,
  renderCell: ({ row }) =>
  new Date(row.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  },

];
return (
  <Box>

    {/* Header */}

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Stock Inward
      </Typography>
    </Box>

    {/* Search */}

    <Paper sx={{ p: 3, mb: 3 }}>

      <TextField
        fullWidth
        placeholder="Search Product / Barcode / SKU"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Search Results */}

      {filteredProducts.length > 0 && (

        <Paper
          sx={{
            mt: 2,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {filteredProducts.map((product) => (

            <List
              key={product.id}
              fullWidth
              sx={{
                justifyContent: "space-between",
                p: 2,
              }}
              onClick={() => handleSelectProduct(product)}
            >
              <Box textAlign="left">

                <Typography fontWeight="bold">
                  {product.name}
                </Typography>

                <Typography variant="body2">
                  Barcode : {product.barcode}
                </Typography>

              </Box>

              <Typography color="primary">
                Stock : {product.quantity}
              </Typography>

            </List>

          ))}
        </Paper>

      )}

    </Paper>

    {/* Product Card */}

    {selectedProduct && (

      <Card sx={{ mb: 4 }}>

        <CardContent>

          <Typography variant="h6" mb={2}>
            {selectedProduct.name}
          </Typography>

          <Grid container spacing={2}>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>
                <b>Barcode :</b> {selectedProduct.barcode}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>
                <b>Current Stock :</b> {selectedProduct.quantity}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Received Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </Grid>

           <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>

              <Button
                variant="contained"
                disabled={loading}
                onClick={handleUpdateStock}
              >
                {loading ? "Updating..." : "Update Stock"}
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>

    )}

    {/* History */}

    <Typography
      variant="h5"
      fontWeight="bold"
      mb={2}
    >
      Stock History
    </Typography>

    <Paper
      sx={{
        height: 500,
      }}
    >
      <DataGrid
        rows={history}
        columns={historyColumns}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            fontWeight: "bold",
          },
        }}
      />
    </Paper>

    {/* Snackbar */}

    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() =>
        setSnackbar({
          ...snackbar,
          open: false,
        })
      }
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

  </Box>
);
}