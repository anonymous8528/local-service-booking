import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data);
      const role = res.data.role;
      navigate(role === "PROVIDER" ? "/dashboard" : role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h1>Log in</h1>
      {error && <p className="alert">{error}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" type="submit">Log in</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
