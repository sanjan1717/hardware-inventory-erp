import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const data = [
  { day: "Mon", sales: 12000 },
  { day: "Tue", sales: 18000 },
  { day: "Wed", sales: 15000 },
  { day: "Thu", sales: 22000 },
  { day: "Fri", sales: 18290 },
  { day: "Sat", sales: 25000 },
  { day: "Sun", sales: 20000 },
];

export default function SalesChart() {
  return (
    <Card sx={{ mt: 4, borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Weekly Sales
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1976d2"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}