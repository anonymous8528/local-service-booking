import { useEffect, useState } from "react";
import api, { errorMessage } from "../api.js";
import { dateLabel, timeLabel } from "../dates.js";

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [error, setError] = useState("");

  function load() {
    api.get("/api/dashboard/slots").then((r) => setSlots(r.data)).catch((e) => setError(errorMessage(e)));
    api.get("/api/dashboard/bookings").then((r) => setBookings(r.data)).catch((e) => setError(errorMessage(e)));
  }
  useEffect(load, []);

  async function addSlot(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/dashboard/slots", {
        startTime: `${date}T${start}:00`,
        endTime: `${date}T${end}:00`,
      });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function removeSlot(id) {
    setError("");
    try {
      await api.delete(`/api/dashboard/slots/${id}`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h1>Your dashboard</h1>
      {error && <p className="alert">{error}</p>}

      <div className="two-col">
        <section>
          <h2>Add an open time</h2>
          <form className="panel flat" onSubmit={addSlot}>
            <label htmlFor="date">Date</label>
            <input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
            <div className="split">
              <div>
                <label htmlFor="start">From</label>
                <input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="end">To</label>
                <input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
              </div>
            </div>
            <button className="btn" type="submit">Add time</button>
          </form>

          <h2>Your times</h2>
          {slots.length === 0 && <p className="empty">No times yet. Add one above so customers can book you.</p>}
          <div className="list">
            {slots.map((s) => (
              <div key={s.id} className="row">
                <div>
                  {dateLabel(s.startTime)}, {timeLabel(s.startTime)} – {timeLabel(s.endTime)}
                </div>
                <div className="row-end">
                  <span className={`tag ${s.booked ? "" : "off"}`}>{s.booked ? "Booked" : "Open"}</span>
                  {!s.booked && <button className="btn ghost" onClick={() => removeSlot(s.id)}>Remove</button>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Bookings</h2>
          {bookings.length === 0 && <p className="empty">No bookings yet.</p>}
          <div className="list">
            {bookings.map((b) => (
              <div key={b.id} className={`row ${b.status === "CANCELLED" ? "faded" : ""}`}>
                <div>
                  <strong>{b.customerName}</strong>
                  <div className="muted">{dateLabel(b.startTime)}, {timeLabel(b.startTime)}</div>
                  {b.note && <div className="muted">Note: {b.note}</div>}
                </div>
                <span className={`tag ${b.status === "CANCELLED" ? "off" : ""}`}>{b.status === "BOOKED" ? "Booked" : "Cancelled"}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
