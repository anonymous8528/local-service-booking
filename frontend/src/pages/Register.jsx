import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const CATEGORIES = ["ELECTRICIAN", "PLUMBER", "TUTOR", "CARPENTER", "CLEANER"];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "CUSTOMER",
    category: "ELECTRICIAN", city: "", hourlyRate: "", bio: "",
  });
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const isProvider = form.role === "PROVIDER";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const body = {
      name: form.name, email: form.email, password: form.password, role: form.role,
      ...(isProvider && {
        category: form.category,
        city: form.city,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
        bio: form.bio,
      }),
    };
    try {
      const res = await api.post("/api/auth/register", body);
      login(res.data);
      navigate(isProvider ? "/dashboard" : "/");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h1>Create your account</h1>
      {error && <p className="alert">{error}</p>}

      <div className="chips" role="group" aria-label="Account type">
        <button type="button" className={`chip ${!isProvider ? "on" : ""}`} onClick={() => setForm({ ...form, role: "CUSTOMER" })}>I need a service</button>
        <button type="button" className={`chip ${isProvider ? "on" : ""}`} onClick={() => setForm({ ...form, role: "PROVIDER" })}>I offer a service</button>
      </div>

      <label htmlFor="name">Full name</label>
      <input id="name" value={form.name} onChange={set("name")} required />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={form.email} onChange={set("email")} required />
      <label htmlFor="password">Password (at least 6 characters)</label>
      <input id="password" type="password" minLength="6" value={form.password} onChange={set("password")} required />

      {isProvider && (
        <>
          <label htmlFor="category">Your trade</label>
          <select id="category" value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
          <label htmlFor="city">City</label>
          <input id="city" value={form.city} onChange={set("city")} />
          <label htmlFor="rate">Hourly rate (₹)</label>
          <input id="rate" type="number" min="0" value={form.hourlyRate} onChange={set("hourlyRate")} />
          <label htmlFor="bio">About you</label>
          <textarea id="bio" rows="3" maxLength="500" value={form.bio} onChange={set("bio")} />
        </>
      )}

      <button className="btn" type="submit">Create account</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
