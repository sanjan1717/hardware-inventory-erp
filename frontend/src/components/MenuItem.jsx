import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

export default function MenuItem({
  icon,
  text,
  path,
  onClick,
}) {
  const location = useLocation();

  return (
    <ListItemButton
      component={path ? Link : "button"}
      to={path}
      onClick={onClick}
      selected={path ? location.pathname === path : false}
      sx={{
        mx: 1,
        my: 0.5,
        borderRadius: 2,
        color: "#fff",
        transition: "0.2s",

        "&:hover": {
          bgcolor: "#1F2937",
          transform: "translateX(4px)",
        },

        "&.Mui-selected": {
          bgcolor: "#2563EB",
        },

        "&.Mui-selected:hover": {
          bgcolor: "#1D4ED8",
        },
      }}
    >
      <ListItemIcon
        sx={{
          color: "#fff",
          minWidth: 40,
        }}
      >
        {icon}
      </ListItemIcon>

      <ListItemText primary={text} />
    </ListItemButton>
  );
}