import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  // If already logged in, go directly to dashboard
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Login button clicked");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("API Response:", res.data);

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      console.log("User:", res.data.user);

      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);

      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={5}
        sx={{
          padding: 4,
          marginTop: 10,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Hardware Inventory
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
}

export default Login;