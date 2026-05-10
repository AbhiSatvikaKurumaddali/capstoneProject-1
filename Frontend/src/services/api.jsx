import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
