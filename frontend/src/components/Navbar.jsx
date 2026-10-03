import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="nav">
      <Link to="/" className="brand">LocalServe</Link>
      <nav className="nav-links">
        <NavLink to="/">Find help</NavLink>
        {user?.role === "CUSTOMER" && <NavLink to="/my-bookings">My bookings</NavLink>}
        {user?.role === "PROVIDER" && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user?.role === "ADMIN" && <NavLink to="/admin">Admin</NavLink>}
        {user ? (
          <>
            <span className="muted">{user.name}</span>
            <button className="btn ghost" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/register" className="btn">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
