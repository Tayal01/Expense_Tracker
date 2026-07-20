import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { EyeIcon } from "./Login.jsx";

// Rough client-side strength estimate: length plus character variety.
// Purely a hint — the backend only enforces the 6-character minimum.
function passwordStrength(pw) {
  if (!pw) return null;
  if (pw.length < 6) return { level: 0, label: "Too short" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak" };
  if (score <= 2) return { level: 2, label: "Okay" };
  return { level: 3, label: "Strong" };
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/login", {
        state: { message: "Account created! Please log in to continue." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <h1>Create your account</h1>
      <p className="subtitle">
        Start tracking your income and expenses in minutes.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="reg-name">Name</label>
        <input
          id="reg-name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="reg-password">Password</label>
        <div className="password-field">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
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

        {(() => {
          const strength = passwordStrength(password);
          if (!strength) return null;
          return (
            <div className={`pw-meter level-${strength.level}`}>
              <div className="pw-segs">
                <span className={strength.level >= 1 ? "pw-seg on" : "pw-seg"} />
                <span className={strength.level >= 2 ? "pw-seg on" : "pw-seg"} />
                <span className={strength.level >= 3 ? "pw-seg on" : "pw-seg"} />
              </div>
              <span className="pw-label">{strength.label}</span>
            </div>
          );
        })()}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="switch-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
