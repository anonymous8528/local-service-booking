import { useEffect, useState } from "react";
import api, { errorMessage } from "../api.js";
import { dateLabel, timeLabel } from "../dates.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api.get("/api/bookings/my").then((res) => setBookings(res.data)).catch((e) => setError(errorMessage(e)));

  useEffect(() => { load(); }, []);

  async function cancel(id) {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.patch(`/api/bookings/${id}/cancel`);
      setError("");
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <>
      <h1>My bookings</h1>
      {error && <p className="alert">{error}</p>}
      {bookings.length === 0 && <p className="empty">You have no bookings yet. Find a provider and pick a time.</p>}
      <div className="list">
        {bookings.map((b) => (
          <div key={b.id} className={`row ${b.status === "CANCELLED" ? "faded" : ""}`}>
            <div>
              <strong>{b.providerName}</strong>
              <div className="muted">{dateLabel(b.startTime)}, {timeLabel(b.startTime)} – {timeLabel(b.endTime)}</div>
              {b.note && <div className="muted">Note: {b.note}</div>}
            </div>
            <div className="row-end">
              <span className={`tag ${b.status === "CANCELLED" ? "off" : ""}`}>{b.status === "BOOKED" ? "Booked" : "Cancelled"}</span>
              {b.status === "BOOKED" && <button className="btn ghost" onClick={() => cancel(b.id)}>Cancel</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
