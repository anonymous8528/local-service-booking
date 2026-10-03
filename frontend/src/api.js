import axios from "axios";

// Every request goes to the Spring Boot backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Attach the JWT (if we have one) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any error into a simple message we can show on screen.
export function errorMessage(err) {
  return err?.response?.data?.message || "Could not reach the server. Please try again.";
}

export default api;
