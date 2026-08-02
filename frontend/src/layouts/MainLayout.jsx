import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const drawerWidth = 260;

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#F3F4F6",
      }}
    >
      <Sidebar drawerWidth={drawerWidth} />

      <Navbar drawerWidth={drawerWidth} />

     <Box
  component="main"
  sx={{
    flexGrow: 1,
    minHeight: "100vh",
    overflowY: "auto",
    p: 4,
  }}
>
    
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}