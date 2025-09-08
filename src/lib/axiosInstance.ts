import axios from "axios";

// fall back to VITE_API_URL or a local default for dev.
const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // include cookies when allowed by the server and browser
  headers: {
    "Content-Type": "application/json",
  },
});
