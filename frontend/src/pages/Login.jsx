import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

function EyeIcon({ off }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export { EyeIcon };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password, remember);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <h1>Welcome back</h1>
      <p className="subtitle">
        Enter your email and password to access your account.
      </p>

      {successMessage && <div className="success-banner">{successMessage}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <div className="password-field">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me on this device
        </label>

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="switch-link">
        Don't have an account? <Link to="/register">Register now</Link>
      </p>
    </AuthLayout>
  );
}
