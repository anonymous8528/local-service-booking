import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { CATEGORIES, labelOf } from "../categories.js";

const initials = (name) =>
  (name || "?").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function Providers() {
  // The home page search sends ?category=PLUMBER&q=lucknow, so we start from the URL.
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "");
  const [query, setQuery] = useState(params.get("q") || "");
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

  // Search runs in the browser on the list we already have.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) =>
      [p.name, p.city, p.bio, p.category].some((v) => v && v.toLowerCase().includes(q))
    );
  }, [providers, query]);

  return (
    <>
      <section className="ls-hero">
        <h1>Find a local pro</h1>
        <p className="muted">Pick a category, choose an open slot, and you are booked. No phone calls.</p>
      </section>

      <div className="ls-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <label htmlFor="provider-search" className="sr-only" style={{ position: "absolute", left: -9999 }}>Search providers</label>
        <input
          id="provider-search"
          type="search"
          placeholder="Search by name or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="ls-chips" role="group" aria-label="Filter by category">
        <button className={`ls-chip ${category === "" ? "on" : ""}`} onClick={() => setCategory("")}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.key} className={`ls-chip ${category === c.key ? "on" : ""}`} onClick={() => setCategory(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      {error && <p className="alert">{error}</p>}

      {loading && (
        <div className="ls-list" aria-busy="true" aria-label="Loading providers">
          <div className="pro-skel" /><div className="pro-skel" /><div className="pro-skel" />
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <p className="empty">
          {providers.length === 0
            ? "No providers here yet. Create a provider account to be the first."
            : "No one matches that search. Try a different name or city."}
        </p>
      )}

      {!loading && visible.length > 0 && (
        <>
          <p className="ls-count">{visible.length} {visible.length === 1 ? "pro" : "pros"} available</p>
          <div className="ls-list">
            {visible.map((p) => (
              <article key={p.id} className="pro" data-cat={p.category}>
                <div className="pro-avatar" aria-hidden="true">{initials(p.name)}</div>
                <div>
                  <div className="pro-head">
                    <h3>{p.name}</h3>
                    {p.hourlyRate ? <span className="pro-rate">₹{p.hourlyRate}<small>/hour</small></span> : null}
                  </div>
                  <p className="pro-meta">{labelOf(p.category)}, {p.city || "city not set"}</p>
                  {p.bio && <p className="pro-bio">{p.bio}</p>}
                  <Link className="btn" to={`/providers/${p.id}`}>See open slots</Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
