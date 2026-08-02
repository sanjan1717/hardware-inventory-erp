import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import DashboardCard from "../components/DashboardCard";
import { getDashboardStats } from "../services/dashboardService";

// Icons
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SalesChart from "../components/SalesChart";
import LowStockTable from "../components/LowStockTable";

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    products: 0,
    customers: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
   <Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Today's Sales"
      value={`₹${Number(stats.todaySales).toLocaleString("en-IN")}`}
      icon={<CurrencyRupeeIcon fontSize="large" />}
      color="#2E7D32"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Products"
      value={stats.products}
      icon={<Inventory2Icon fontSize="large" />}
      color="#1565C0"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <DashboardCard
      title="Customers"
      value={stats.customers}
      icon={<PeopleIcon fontSize="large" />}
      color="#6A1B9A"
    />
        </Grid>

      <Grid size={{ xs: 12 }}>
        <SalesChart />
      </Grid>
      <Grid size={{ xs: 12 }}>
  <LowStockTable />
</Grid>
    </Grid>
    
  );
};

export default Dashboard;