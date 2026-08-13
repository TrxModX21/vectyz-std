import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1", // Base API URL Backend
  withCredentials: true, // Wajib agar Cookie Session dikirim/diterima
});

// Optional: Add interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bisa handle global error di sini (misal toast error)
    return Promise.reject(error);
  }
);
