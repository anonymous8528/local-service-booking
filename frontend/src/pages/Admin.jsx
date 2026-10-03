import { useEffect, useState } from "react";
import api, { errorMessage } from "../api.js";
import { dateLabel, timeLabel } from "../dates.js";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fail = (e) => setError(errorMessage(e));
    api.get("/api/admin/stats").then((r) => setStats(r.data)).catch(fail);
    api.get("/api/admin/users").then((r) => setUsers(r.data)).catch(fail);
    api.get("/api/admin/bookings").then((r) => setBookings(r.data)).catch(fail);
  }, []);

  return (
    <>
      <h1>Admin overview</h1>
      {error && <p className="alert">{error}</p>}

      {stats && (
        <div className="stats">
          <div><strong>{stats.users}</strong><span>Users</span></div>
          <div><strong>{stats.providers}</strong><span>Providers</span></div>
          <div><strong>{stats.bookings}</strong><span>Bookings made</span></div>
          <div><strong>{stats.activeBookings}</strong><span>Active now</span></div>
        </div>
      )}

      <h2>Users</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Trade</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.category || "-"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>All bookings</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Provider</th><th>When</th><th>Status</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.customerName}</td>
                <td>{b.providerName}</td>
                <td>{dateLabel(b.startTime)}, {timeLabel(b.startTime)}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
