import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api.js";

const CATEGORIES = ["ELECTRICIAN", "PLUMBER", "TUTOR", "CARPENTER", "CLEANER"];
const pretty = (c) => c.charAt(0) + c.slice(1).toLowerCase();

export default function Providers() {
  const [category, setCategory] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/providers", { params: category ? { category } : {} })
      .then((res) => { setProviders(res.data); setError(""); })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <section className="intro">
        <h1>Book a trusted local pro for a time that suits you</h1>
        <p className="muted">Pick a category, choose an open slot, and you are booked. No phone calls.</p>
      </section>

      <div className="chips" role="group" aria-label="Filter by category">
        <button className={`chip ${category === "" ? "on" : ""}`} onClick={() => setCategory("")}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${category === c ? "on" : ""}`} onClick={() => setCategory(c)}>
            {pretty(c)}
          </button>
        ))}
      </div>

      {error && <p className="alert">{error}</p>}
      {loading && <p className="muted">Loading providers...</p>}
      {!loading && !error && providers.length === 0 && (
        <p className="empty">No providers here yet. Create a provider account to be the first.</p>
      )}

      <div className="grid">
        {providers.map((p) => (
          <article key={p.id} className="card">
            <div className="card-top">
              <h3>{p.name}</h3>
              <span className="tag">{pretty(p.category)}</span>
            </div>
            <p className="muted">{p.city || "City not set"}{p.hourlyRate ? ` · ₹${p.hourlyRate}/hour` : ""}</p>
            {p.bio && <p>{p.bio}</p>}
            <Link className="btn" to={`/providers/${p.id}`}>See open slots</Link>
          </article>
        ))}
      </div>
    </>
  );
}
