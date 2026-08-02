import { useEffect, useState, useRef } from "react";
import API from "../services/api";

import {
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function ProductSearch({ onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/pos");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return false;

    return (
      (product.name || "").toLowerCase().startsWith(keyword) ||
      (product.sku || "").toLowerCase().startsWith(keyword) ||
      (product.barcode || "").startsWith(keyword)
    );
  });

  const handleAdd = (product) => {
    onAddProduct(product);

    setSearch("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        Search Product
      </Typography>

      <TextField
        inputRef={inputRef}
        fullWidth
        autoFocus
        label="Scan Barcode or Search Product"
        placeholder="Scan barcode or type product name..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);

          // Auto-add when exact barcode matches
          const barcodeProduct = products.find(
            (product) => (product.barcode || "") === value
          );

          if (barcodeProduct) {
            handleAdd(barcodeProduct);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filteredProducts.length > 0) {
            handleAdd(filteredProducts[0]);
          }
        }}
      />

      <List sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}>
        {search !== "" &&
          filteredProducts.map((product) => (
            <ListItem
              key={product.id}
              divider
              secondaryAction={
                <Button
                  variant="contained"
                  onClick={() => handleAdd(product)}
                >
                  Add
                </Button>
              }
            >
              <ListItemText
                primary={
                  <Typography fontWeight="bold">
                    {product.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2">
                      Price: ₹{Number(product.selling_price).toFixed(2)}
                    </Typography>

                    <Typography variant="body2">
                      Stock: {product.quantity}
                    </Typography>

                    <Typography variant="body2">
                      GST: {product.gst_name}
                    </Typography>

                    <Typography variant="body2">
                      SKU: {product.sku || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                      Barcode: {product.barcode || "N/A"}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
      </List>
    </Paper>
  );
}