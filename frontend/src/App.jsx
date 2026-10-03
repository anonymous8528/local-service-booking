import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Providers from "./pages/Providers.jsx";
import ProviderDetail from "./pages/ProviderDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Providers />} />
          <Route path="/providers/:id" element={<ProviderDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<ProtectedRoute role="CUSTOMER"><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute role="PROVIDER"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
