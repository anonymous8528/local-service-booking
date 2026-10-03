import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

// Shows the page only to a logged-in user with the right role.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
