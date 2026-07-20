import React from "react";
import { Link } from "react-router-dom";

// Shared split-screen shell for the login/register pages: marketing hero
// panel on the left with the brand in its top-left corner, the form on the
// right. On small screens the hero hides and the brand moves above the form.
export default function AuthLayout({ children }) {
  const brand = (
    <>
      <span className="brand-mark">₹</span>
      <span className="brand-name">
        Expense<em>Flow</em>
      </span>
    </>
  );

  return (
    <div className="auth-shell">
      <aside className="auth-hero">
        <Link to="/" className="brand auth-brand hero-brand">
          {brand}
        </Link>

        <div className="auth-hero-inner">
          <h2>Effortlessly track your income and spending.</h2>
          <p>
            One dashboard for your cash flow — add transactions, set monthly
            budget caps, and watch where every rupee goes.
          </p>

          <div className="hero-preview">
            <div className="hero-card">
              <span className="hero-label">Net balance</span>
              <span className="hero-value">₹36,500</span>
              <span className="hero-delta">▲ Saved this month</span>
            </div>
            <div className="hero-card hero-chart">
              <span className="hero-label">Cash flow</span>
              <div className="hero-bars">
                <span className="hb income" style={{ height: "58%" }} />
                <span className="hb expense" style={{ height: "40%" }} />
                <span className="hb income" style={{ height: "74%" }} />
                <span className="hb expense" style={{ height: "52%" }} />
                <span className="hb income" style={{ height: "88%" }} />
                <span className="hb expense" style={{ height: "63%" }} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="auth-form-col">
        <Link to="/" className="brand auth-brand mobile-brand">
          {brand}
        </Link>

        <div className="auth-form-wrap">{children}</div>

        <p className="auth-foot">© 2026 ExpenseFlow · Track every rupee</p>
      </div>
    </div>
  );
}
