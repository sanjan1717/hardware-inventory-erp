import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import CustomerDetails from "./pages/CustomerDetails";
import Categories from "./pages/Categories";
import StockInward from "./pages/StockInward";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Stores from "./pages/Stores";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Main Layout */}
        <Route element={<MainLayout />}>

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute roles={["super_admin", "manager"]}>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/products"
    element={
      <ProtectedRoute roles={["super_admin", "manager"]}>
        <Products />
      </ProtectedRoute>
    }
  />

  <Route
    path="/customers"
    element={
      <ProtectedRoute roles={["super_admin", "manager","cashier"]}>
        <Customers />
      </ProtectedRoute>
    }
  />

  <Route
    path="/customers/:id"
    element={
      <ProtectedRoute roles={["super_admin", "manager", "cashier"]}>
        <CustomerDetails />
      </ProtectedRoute>
    }
  />

  <Route
    path="/billing"
    element={
      <ProtectedRoute roles={["super_admin", "manager", "cashier"]}>
        <Billing />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute roles={["super_admin", "manager","cashier"]}>
        <Reports />
      </ProtectedRoute>
    }
  />

  <Route
    path="/categories"
    element={
      <ProtectedRoute roles={["super_admin","manager","cashier"]}>
        <Categories />
      </ProtectedRoute>
    }
  />

  <Route
    path="/stock-inward"
    element={
      <ProtectedRoute roles={["super_admin", "manager","cashier"]}>
        <StockInward />
      </ProtectedRoute>
    }
  />
 <Route
  path="/stores"
  element={
    <ProtectedRoute roles={["super_admin"]}>
      <Stores />
    </ProtectedRoute>
  }
/>
<Route
  path="/users"
  element={
    <ProtectedRoute roles={["super_admin", "manager"]}>
      <Users />
    </ProtectedRoute>
  }
/>

</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;