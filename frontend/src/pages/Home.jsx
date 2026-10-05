import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Every card is a real category in the backend (see Category.java).
const SERVICES = [
  { key: "CLEANER", name: "Home Cleaning", note: "Book trusted cleaners", tone: "blue", icon: <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /> },
  { key: "PLUMBER", name: "Plumbing", note: "Fix leaks and more", tone: "green", icon: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /> },
  { key: "ELECTRICIAN", name: "Electrician", note: "Safe and professional", tone: "amber", icon: <path d="M13 3L5 13h6l-1 8 8-10h-6z" /> },
  { key: "CARPENTER", name: "Carpentry", note: "Custom woodwork", tone: "orange", icon: <><path d="M14 6l4 4-8 8-4-4z" /><path d="M13 7l3-3 4 4-3 3" /></> },
  { key: "BEAUTY", name: "Beauty and Wellness", note: "Relax and rejuvenate", tone: "pink", icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /> },
  { key: "TUTOR", name: "Tutoring", note: "Learn with experts", tone: "violet", icon: <><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z" /><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z" /></> },
  { key: "PET", name: "Pet Care", note: "For your furry friends", tone: "teal", icon: <><circle cx="7" cy="10" r="1.6" /><circle cx="11" cy="6.5" r="1.6" /><circle cx="15.5" cy="7" r="1.6" /><circle cx="18" cy="11" r="1.6" /><path d="M8 17c0-3 3-5 5-5s5 2 5 5c0 2-2 2.5-5 2.5S8 19 8 17z" /></> },
  { key: "PAINT", name: "Painting", note: "Fresh look for home", tone: "orange", icon: <><rect x="5" y="4" width="13" height="5" rx="1" /><path d="M18 6.5h2v5h-8v3" /><rect x="11" y="14.5" width="2.5" height="6" rx="1" /></> },
];


const FEATURES = [
  { title: "Separate accounts", text: "Customers, providers and admins each get their own view", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1-4 4-6 8-6s7 2 8 6" /></> },
  { title: "No double bookings", text: "A booked slot can never be taken twice", icon: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 14l2 2 4-4" /></> },
  { title: "Email confirmations", text: "Get notified as soon as a booking is made", icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></> },
  { title: "Provider dashboard", text: "Providers manage their own open slots", icon: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></> },
];

const STEPS = [
  { n: 1, title: "Search", text: "Find the service you need in your area", tone: "blue", icon: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></> },
  { n: 2, title: "Book", text: "Choose a time that works for you", tone: "green", icon: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></> },
  { n: 3, title: "Get it done", text: "Your professional handles the rest", tone: "violet", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1-4 4-6 8-6s7 2 8 6" /></> },
];

const Svg = ({ children, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [where, setWhere] = useState("");
  const [service, setService] = useState("");

  // Lets the About link in the navbar scroll to the How it works section.
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  function search(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set("category", service);
    if (where.trim()) params.set("q", where.trim());
    const qs = params.toString();
    navigate(`/providers${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">Book local pros online</span>
          <h1>Find and book trusted <span className="hl">local services</span></h1>
          <p>From home repairs to tutoring, book a local professional for a time that suits you. No phone calls, no waiting.</p>

          <form className="hero-search" onSubmit={search}>
            <label className="field">
              <span className="sr">Your location</span>
              <Svg size={18}><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>
              <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Enter your city or name" />
            </label>
            <label className="field">
              <span className="sr">Service</span>
              <select value={service} onChange={(e) => setService(e.target.value)}>
                <option value="">All services</option>
                {SERVICES.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
              </select>
            </label>
            <button className="btn go" type="submit"><Svg size={18}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Svg>Search</button>
          </form>

          <ul className="hero-points">
            <li><Svg size={18}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></Svg>No double bookings</li>
            <li><Svg size={18}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Svg>Email confirmations</li>
            <li><Svg size={18}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></Svg>Easy booking</li>
          </ul>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="blob b1" /><div className="blob b2" />
          <div className="art-card a1"><span className="dot blue" />Home Cleaning</div>
          <div className="art-card a2"><span className="dot amber" />Electrician</div>
          <div className="art-main">
            <p className="art-title">Your booking</p>
            <p className="art-big">Tomorrow, 4:00 PM</p>
            <p className="art-sub">Slot reserved. Confirmation sent to your email.</p>
            <span className="art-pill">Confirmed</span>
          </div>
        </div>
      </section>

      <section className="block" id="services">
        <div className="block-head">
          <div>
            <h2>Popular services</h2>
            <p className="muted">Choose from a range of local services</p>
          </div>
          <Link to="/providers" className="view-all">View all →</Link>
        </div>

        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Link key={s.key} to={`/providers?category=${s.key}`} className={`svc tone-${s.tone}`}>
              <span className="svc-ico"><Svg size={26}>{s.icon}</Svg></span>
              <strong>{s.name}</strong>
              <small>{s.note}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="strip" aria-label="Why LocalServe">
        {FEATURES.map((f) => (
          <div key={f.title} className="strip-item">
            <span className="strip-ico"><Svg size={26}>{f.icon}</Svg></span>
            <div><strong>{f.title}</strong><small>{f.text}</small></div>
          </div>
        ))}
      </section>

      <section className="block how" id="how-it-works">
        <div className="how-intro">
          <h2>How it works</h2>
          <p className="muted">Get your service in a few simple steps</p>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n} className="step">
              <span className={`step-n tone-${s.tone}`}>{s.n}</span>
              <span className={`step-ico tone-${s.tone}`}><Svg size={22}>{s.icon}</Svg></span>
              <div><strong>{s.title}</strong><small>{s.text}</small></div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
