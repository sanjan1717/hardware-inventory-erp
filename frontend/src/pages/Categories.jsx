import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import API from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [gstRates, setGstRates] = useState([]);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    category_name: "",
    gst_rate_id: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGstRates = async () => {
    try {
      const res = await API.get("/gst");
      setGstRates(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGstRates();
  }, []);

  const handleSave = async () => {
    try {
      await API.post("/categories", formData);

      setOpen(false);

      setFormData({
        category_name: "",
        gst_rate_id: "",
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Categories
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Category
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>GST</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.category_name}</TableCell>
                <TableCell>{cat.gst_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Category</DialogTitle>

        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            margin="dense"
            value={formData.category_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_name: e.target.value,
              })
            }
          />

          <TextField
            select
            label="GST"
            fullWidth
            margin="dense"
            value={formData.gst_rate_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                gst_rate_id: e.target.value,
              })
            }
          >
            {gstRates.map((gst) => (
              <MenuItem key={gst.id} value={gst.id}>
                {gst.gst_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

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
