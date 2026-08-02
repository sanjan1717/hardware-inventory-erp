import { Box, Typography } from "@mui/material";
import HandymanIcon from "@mui/icons-material/Handyman";

export default function Logo() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
      }}
    >
      <HandymanIcon
        sx={{
          fontSize: 48,
          color: "#3B82F6",
        }}
      />

      <Typography
        variant="h6"
        fontWeight="bold"
        mt={1}
      >
        Hardware ERP
      </Typography>

      <Typography
        variant="body2"
        color="gray"
      >
        Inventory Management
      </Typography>
    </Box>
  );
}