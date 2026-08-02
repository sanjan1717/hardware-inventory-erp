import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DashboardCard({
  title,
  value,
  icon,
  color = "#1976d2",
}) {
  return (
    <Card
  elevation={4}
  sx={{
    height: "100%",
    borderRadius: 4,
    transition: "0.3s",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: 10,
    },
  }}
>

      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 65,
            height: 65,
            borderRadius: "50%",
            bgcolor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: 3,
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
}