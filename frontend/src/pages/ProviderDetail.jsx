import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { dateKey, nextDays, timeLabel, dateLabel } from "../dates.js";

export default function ProviderDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState(dateKey(new Date()));
  const [picked, setPicked] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const [busy, setBusy] = useState(false);

  const days = useMemo(() => nextDays(14), []);

  function loadSlots(selectFirstDay = false) {
    return api.get(`/api/providers/${id}/slots`).then((res) => {
      setSlots(res.data);
      if (selectFirstDay) {
        const keys = new Set(res.data.map((s) => s.startTime.slice(0, 10)));
        const first = days.map(dateKey).find((k) => keys.has(k));
        if (first) setDay(first);
      }
    });
  }

  useEffect(() => {
    api.get(`/api/providers/${id}`).then((res) => setProvider(res.data)).catch((e) => setError(errorMessage(e)));
    loadSlots(true).catch((e) => setError(errorMessage(e)));
  }, [id]);

  // Group the open slots by day: { "2026-10-12": [slot, slot], ... }
  const byDay = useMemo(() => {
    const map = {};
    slots.forEach((s) => {
      const key = s.startTime.slice(0, 10);
      (map[key] = map[key] || []).push(s);
    });
    return map;
  }, [slots]);

  async function confirmBooking() {
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/api/bookings", { slotId: picked.id, note });
      setConfirmed(res.data);
      setPicked(null);
      setNote("");
      await loadSlots();
    } catch (err) {
      setError(errorMessage(err)); // e.g. "someone just booked this slot"
      setPicked(null);
      await loadSlots(); // refresh so the taken slot disappears
    } finally {
      setBusy(false);
    }
  }

  if (!provider) return error ? <p className="alert">{error}</p> : <p className="muted">Loading...</p>;

  const todays = byDay[day] || [];

  return (
    <>
      <Link to="/" className="back">Back to all providers</Link>
      <h1>{provider.name}</h1>
      <p className="muted">
        {provider.category.charAt(0) + provider.category.slice(1).toLowerCase()}
        {provider.city ? ` · ${provider.city}` : ""}
        {provider.hourlyRate ? ` · ₹${provider.hourlyRate}/hour` : ""}
      </p>
      {provider.bio && <p>{provider.bio}</p>}

      {confirmed && (
        <div className="success">
          Booked for {dateLabel(confirmed.startTime)} at {timeLabel(confirmed.startTime)}.{" "}
          <Link to="/my-bookings">See my bookings</Link>
        </div>
      )}
      {error && <p className="alert">{error}</p>}

      <h2>Choose a day</h2>
      <div className="days">
        {days.map((d) => {
          const key = dateKey(d);
          const count = (byDay[key] || []).length;
          return (
            <button
              key={key}
              className={`day ${key === day ? "on" : ""}`}
              disabled={count === 0}
              onClick={() => { setDay(key); setPicked(null); }}
              aria-label={`${d.toDateString()}, ${count} open slots`}
            >
              <span className="dow">{d.toLocaleDateString([], { weekday: "short" })}</span>
              <span className="num">{d.getDate()}</span>
              <span className="count">{count > 0 ? `${count} open` : "none"}</span>
            </button>
          );
        })}
      </div>

      <h2>Choose a time</h2>
      {todays.length === 0 ? (
        <p className="empty">No open times on this day. Try another day.</p>
      ) : (
        <div className="times">
          {todays.map((s) => (
            <button
              key={s.id}
              className={`time ${picked?.id === s.id ? "on" : ""}`}
              onClick={() => { setPicked(s); setConfirmed(null); setError(""); }}
            >
              {timeLabel(s.startTime)} – {timeLabel(s.endTime)}
            </button>
          ))}
        </div>
      )}

      {picked && (
        <div className="ticket">
          <h3>Your booking</h3>
          <p>
            {provider.name}<br />
            {dateLabel(picked.startTime)}, {timeLabel(picked.startTime)} – {timeLabel(picked.endTime)}
          </p>
          {!user && <p><Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> as a customer to book this time.</p>}
          {user && user.role !== "CUSTOMER" && <p className="muted">Only customer accounts can book.</p>}
          {user?.role === "CUSTOMER" && (
            <>
              <label htmlFor="note">What do you need help with? (optional)</label>
              <textarea id="note" rows="3" maxLength="500" value={note} onChange={(e) => setNote(e.target.value)} />
              <button className="btn" onClick={confirmBooking} disabled={busy}>
                {busy ? "Booking..." : "Confirm booking"}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
