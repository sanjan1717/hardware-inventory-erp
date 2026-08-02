import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";

import StoreIcon from "@mui/icons-material/Store";
import colors from "../theme/colors";

export default function Navbar({ drawerWidth }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const initials =
    user?.full_name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "#fff",
        color: colors.text,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Hardware Inventory ERP
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Welcome back 👋
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Chip
            icon={<StoreIcon />}
            label={
              user?.role === "admin"
                ? "All Stores"
                : user?.store_name || "Assigned Store"
            }
            variant="outlined"
          />

          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {user?.full_name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {user.role === "cashier"
  ? "USER"
  : user.role.replace("_", " ").toUpperCase()}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: colors.primary,
              fontWeight: "bold",
            }}
          >
            {initials}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}