import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [stores, setStores] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);


const [open, setOpen] = useState(false);
const [showPassword, setShowPassword] =
  useState(false);

const [isEdit, setIsEdit] = useState(false);

const [selectedId, setSelectedId] = useState(null);

const [formData, setFormData] = useState({
  full_name: "",
  email: "",
  password: "",
  role: "cashier",
  store_id: "",
  is_active: true,
});
const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});
const showSnackbar = (message, severity = "success") => {
  setSnackbar({
    open: true,
    message,
    severity,
  });
};
  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
  try {
    setLoading(true);

    const res = await API.get("/users");

    setUsers(res.data.users);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  const handleSave = async () => {
  // Validation
  if (!formData.full_name.trim()) {
    return showSnackbar("Name is required", "error");
  }

  if (!formData.email.trim()) {
    return showSnackbar("Email is required", "error");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    return showSnackbar("Invalid email address", "error");
  }

  if (!isEdit && formData.password.length < 6) {
    return showSnackbar(
      "Password must be at least 6 characters",
      "error"
    );
  }

  try {
    setSaving(true);

    if (isEdit) {
      await API.put(`/users/${selectedId}`, {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        store_id: formData.store_id,
        is_active: formData.is_active,
      });

      showSnackbar("User updated successfully", "success");
    } else {
      console.log("Sending:", formData);
await API.post("/users", formData);

      showSnackbar("User added successfully", "success");
    }

    fetchUsers();

    setOpen(false);
    setIsEdit(false);
    setSelectedId(null);

    setFormData({
      full_name: "",
      email: "",
      password: "",
      role: "cashier",
      store_id: "",
      is_active: true,
    });

  } catch (err) {
    console.error(err);

    showSnackbar(
      err.response?.data?.message || "Failed to save user",
      "error"
    );
  } finally {
    setSaving(false);
  }
};
 const handleEdit = (user) => {

  setIsEdit(true);

  setSelectedId(user.id);

  setFormData({
    full_name: user.full_name,
    email: user.email,
    password: "",
    role: user.role,
    store_id: user.store_id,
    is_active: user.is_active,
  });

  setOpen(true);
};

 const handleDelete = (id) => {
  setDeleteId(id);
  setDeleteOpen(true);
};
const confirmDelete = async () => {
  try {
    await API.delete(`/users/${deleteId}`);

    fetchUsers();

    showSnackbar("User deleted successfully", "success");
  } catch (err) {
    console.error(err);

    showSnackbar(
      err.response?.data?.message || "Failed to delete user",
      "error"
    );
  } finally {
    setDeleteOpen(false);
    setDeleteId(null);
  }
};
  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "full_name",
      headerName: "Name",
      flex: 1.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
    },
    {
      field: "role",
      headerName: "Role",
      width: 160,
    },
    {
      field: "store_name",
      headerName: "Store",
      flex: 1.5,
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 140,
      renderCell: (params) =>
        params.row.is_active ? (
          <Chip label="Active" color="success" />
        ) : (
          <Chip label="Inactive" color="error" />
        ),
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
          Users
        </Typography>

        <TextField
          size="small"
          placeholder="Search users..."
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
      full_name: "",
      email: "",
      password: "",
      role: "cashier",
      store_id: "",
      is_active: true,
    });

    setOpen(true);
  }}
>
  Add User
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
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50, 100]}
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
      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>
    {isEdit ? "Edit User" : "Add User"}
  </DialogTitle>

  <DialogContent>

    <TextField
      margin="dense"
      fullWidth
      label="Full Name"
      value={formData.full_name}
      onChange={(e) =>
        setFormData({
          ...formData,
          full_name: e.target.value,
        })
      }
    />

    <TextField
      margin="dense"
      fullWidth
      label="Email"
      type="email"
      value={formData.email}
      onChange={(e) =>
        setFormData({
          ...formData,
          email: e.target.value,
        })
      }
    />

    {!isEdit && (
      <TextField
  margin="dense"
  fullWidth
  label="Password"
  type={showPassword ? "text" : "password"}
  value={formData.password}
  onChange={(e) =>
    setFormData({
      ...formData,
      password: e.target.value,
    })
  }
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          {showPassword
            ? <VisibilityOff />
            : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
    )}

    <TextField
      margin="dense"
      fullWidth
      select
      label="Role"
      value={formData.role}
      onChange={(e) =>
        setFormData({
          ...formData,
          role: e.target.value,
        })
      }
    >
      <MenuItem value="super_admin">Super Admin</MenuItem>
      <MenuItem value="manager">Manager</MenuItem>
      <MenuItem value="cashier">user</MenuItem>
    </TextField>

    <TextField
      margin="dense"
      fullWidth
      select
      label="Store"
      value={formData.store_id}
      onChange={(e) =>
        setFormData({
          ...formData,
          store_id: e.target.value,
        })
      }
    >
      {stores.map((store) => (
        <MenuItem
          key={store.id}
          value={store.id}
        >
          {store.name}
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
  disabled={saving}
>
  {saving
    ? "Saving..."
    : isEdit
    ? "Update"
    : "Save"}
</Button>

  </DialogActions>
</Dialog>
<Dialog
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
>
  <DialogTitle>Delete User</DialogTitle>

  <DialogContent>
    Are you sure you want to delete this user?
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setDeleteOpen(false)}>
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={confirmDelete}
    >
      Delete
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
    
  <Alert severity={snackbar.severity}>
    {snackbar.message}
  </Alert>
</Snackbar>

    </Box>
  );
}