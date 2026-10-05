import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

// Put your real contact email here. The Contact link opens the visitor's mail app.
const CONTACT_EMAIL = "canuj8528@gmail.com";

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const HomeIcon = () => <Icon><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /></Icon>;
const SearchIcon = () => <Icon><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>;
const CalendarIcon = () => <Icon><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></Icon>;
const GridIcon = () => <Icon><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></Icon>;
const UserIcon = () => <Icon><circle cx="12" cy="8" r="4" /><path d="M4 20c1-4 4-6 8-6s7 2 8 6" /></Icon>;
const OutIcon = () => <Icon><path d="M10 4H5v16h5" /><path d="M15 8l4 4-4 4M19 12H9" /></Icon>;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <header className="nav">
        <Link to="/" className="brand ls-brand">
          <span className="ls-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-5h4v5" />
            </svg>
          </span>
          <span className="ls-brand-text">
            <strong>LocalServe</strong>
            <small>Local services, made simple</small>
          </span>
        </Link>

        <nav className="nav-links ls-center" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/providers">Services</NavLink>
          <Link to="/#how-it-works">About</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </nav>

        <div className="nav-links ls-auth">
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
              <Link to="/login" className="btn ghost">Login</Link>
              <Link to="/register" className="btn">Sign up</Link>
            </>
          )}
        </div>
      </header>

      <nav className="ls-tabbar" aria-label="Quick navigation">
        <NavLink to="/" end><HomeIcon />Home</NavLink>
        <NavLink to="/providers"><SearchIcon />Services</NavLink>
        {user?.role === "CUSTOMER" && <NavLink to="/my-bookings"><CalendarIcon />Bookings</NavLink>}
        {user?.role === "PROVIDER" && <NavLink to="/dashboard"><GridIcon />Dashboard</NavLink>}
        {user?.role === "ADMIN" && <NavLink to="/admin"><GridIcon />Admin</NavLink>}
        {user ? (
          <button onClick={handleLogout}><OutIcon />Log out</button>
        ) : (
          <NavLink to="/login"><UserIcon />Login</NavLink>
        )}
      </nav>
    </>
  );
}
