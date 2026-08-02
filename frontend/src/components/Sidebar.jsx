import {
  Drawer,
  List,
  Box,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import StoreIcon from "@mui/icons-material/Store";

import { useNavigate } from "react-router-dom";

import Logo from "./Logo";
import MenuItem from "./MenuItem";
import colors from "../theme/colors";
const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["super_admin", "manager"],
  },
  {
  text: "Users",
  icon: <PeopleIcon />,
  path: "/users",
  roles: ["super_admin"],
},
  {
    text: "Products",
    icon: <Inventory2Icon />,
    path: "/products",
    roles: ["super_admin", "manager"],
  },
  {
    text: "Categories",
    icon: <CategoryIcon />,
    path: "/categories",
    roles: ["super_admin", "manager"],
  },
  {
    text: "Stock Inward",
    icon: <MoveToInboxIcon />,
    path: "/stock-inward",
    roles: ["super_admin", "manager","cashier"],
  },
  {
    text: "Customers",
    icon: <PeopleIcon />,
    path: "/customers",
    roles: ["super_admin", "manager", "cashier"],
  },
  {
    text: "Billing",
    icon: <ReceiptLongIcon />,
    path: "/billing",
    roles: ["super_admin", "manager", "cashier"],
  },
  {
    text: "Reports",
    icon: <AssessmentIcon />,
    path: "/reports",
    roles: ["super_admin", "manager","cashier"],
  },
  {
    text: "Stores",
    icon: <StoreIcon />,
    path: "/stores",
    roles: ["super_admin"],
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
    roles: ["super_admin"],
  },
];

export default function Sidebar({ drawerWidth }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: colors.sidebar,
          color: "#fff",
          border: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Logo />

      <Divider
        sx={{
          borderColor: "#374151",
          mb: 2,
        }}
      />

      <List sx={{ flexGrow: 1 }}>
        {filteredMenu.map((item) => (
          <MenuItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            path={item.path}
          />
        ))}
      </List>

      <Divider sx={{ borderColor: "#374151" }} />

      <Box sx={{ p: 2 }}>
        <MenuItem
          icon={<LogoutIcon />}
          text="Logout"
          onClick={handleLogout}
        />
      </Box>
    </Drawer>
  );
}