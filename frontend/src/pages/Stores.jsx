import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Stores() {

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    gst_number: "",
    logo_path: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get("/stores");

      setStores(res.data.stores);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {

      if (isEdit) {
        await API.put(`/stores/${selectedId}`, formData);
      } else {
        await API.post("/stores", formData);
      }

      fetchStores();

      setOpen(false);
      setIsEdit(false);
      setSelectedId(null);

      setFormData({
        name: "",
        code: "",
        address: "",
        phone: "",
        email: "",
        gst_number: "",
        logo_path: "",
      });

    } catch (err) {
      console.error(err);

      alert("Failed to save store");
    }
  };

  const handleEdit = (store) => {

    setIsEdit(true);

    setSelectedId(store.id);

    setFormData({
      name: store.name,
      code: store.code,
      address: store.address,
      phone: store.phone,
      email: store.email,
      gst_number: store.gst_number,
      logo_path: store.logo_path || "",
    });

    setOpen(true);
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this store?")) return;

    try {

      await API.delete(`/stores/${id}`);

      fetchStores();

    } catch (err) {

      console.error(err);

      alert("Failed to delete store");

    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "name",
      headerName: "Store Name",
      flex: 1.5,
    },
    {
      field: "code",
      headerName: "Code",
      width: 130,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 160,
    },
    {
      field: "gst_number",
      headerName: "GST",
      width: 180,
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
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Stores
      </Typography>

      <TextField
        size="small"
        placeholder="Search stores..."
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
            code: "",
            address: "",
            phone: "",
            email: "",
            gst_number: "",
            logo_path: "",
          });

          setOpen(true);
        }}
      >
        Add Store
      </Button>
    </Box>

    {/* DataGrid */}
    <Paper
      sx={{
        height: 550,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={filteredStores}
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        sx={{
          border: 0,
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

    {/* Dialog */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEdit ? "Edit Store" : "Add Store"}
      </DialogTitle>

      <DialogContent>

        <TextField
          margin="dense"
          fullWidth
          label="Store Name"
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
          fullWidth
          label="Store Code"
          value={formData.code}
          onChange={(e) =>
            setFormData({
              ...formData,
              code: e.target.value,
            })
          }
        />

        <TextField
          margin="dense"
          fullWidth
          label="Address"
          multiline
          rows={3}
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value,
            })
          }
        />

        <TextField
          margin="dense"
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({
              ...formData,
              phone: e.target.value,
            })
          }
        />

        <TextField
          margin="dense"
          fullWidth
          label="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <TextField
          margin="dense"
          fullWidth
          label="GST Number"
          value={formData.gst_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              gst_number: e.target.value,
            })
          }
        />

        <TextField
          margin="dense"
          fullWidth
          label="Logo Path (Optional)"
          value={formData.logo_path}
          onChange={(e) =>
            setFormData({
              ...formData,
              logo_path: e.target.value,
            })
          }
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