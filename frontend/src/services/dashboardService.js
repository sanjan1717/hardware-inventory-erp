import axios from "axios";

const API = axios.create({
  baseURL: "https://hardware-inventory-erp.onrender.com/api",
});

// Attach JWT Token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getDashboardStats = async () => {
  const response = await API.get("/dashboard/stats");
  return response.data;
};