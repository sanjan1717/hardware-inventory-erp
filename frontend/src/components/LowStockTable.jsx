import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";

export default function LowStockTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await API.get("/dashboard/low-stock");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ mt: 3, borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          ⚠️ Low Stock Products
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Product</b></TableCell>
              <TableCell><b>SKU</b></TableCell>
              <TableCell><b>Available</b></TableCell>
              <TableCell><b>Min Stock</b></TableCell>
              <TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.min_stock}</TableCell>

                <TableCell>
                  <Chip
                    label={
                      product.quantity === 0
                        ? "Out of Stock"
                        : "Low Stock"
                    }
                    color={
                      product.quantity === 0
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}