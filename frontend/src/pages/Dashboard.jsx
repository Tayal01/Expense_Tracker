import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import ExpenseChart from "../components/ExpenseChart.jsx";
import IncomeExpenseChart from "../components/IncomeExpenseChart.jsx";
import BudgetSection from "../components/BudgetSection.jsx";
import TrendChart from "../components/TrendChart.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [typeFilter, setTypeFilter] = useState(""); // '', 'income', 'expense'
  const [activeForm, setActiveForm] = useState(null); // null | 'income' | 'expense'
  const [timeframe, setTimeframe] = useState("month"); // 'month' | 'all'

  useEffect(() => {
    loadExpenses();
  }, [typeFilter]);

  useEffect(() => {
    loadSummary();
    loadBudgets();
  }, [expenses]);

  async function loadExpenses() {
    try {
      const params = typeFilter ? { type: typeFilter } : {};
      const { data } = await api.get("/expenses", { params });
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses", err);
    }
  }

  async function loadSummary() {
    try {
      const { data } = await api.get("/expenses/analytics/summary");
      setSummary(data);
    } catch (err) {
      console.error("Failed to load summary", err);
    }
  }

  async function loadBudgets() {
    try {
      const { data } = await api.get("/budgets");
      setBudgets(data);
    } catch (err) {
      console.error("Failed to load budgets", err);
    }
  }

  async function handleAdd(expenseData) {
    await api.post("/expenses", expenseData);
    setActiveForm(null);
    loadExpenses();
  }

  async function handleUpdate(id, expenseData) {
    await api.put(`/expenses/${id}`, expenseData);
    loadExpenses();
  }

  async function handleDelete(id) {
    await api.delete(`/expenses/${id}`);
    loadExpenses();
  }

  async function handleSetBudget(budgetData) {
    await api.post("/budgets", budgetData);
    loadBudgets();
  }

  async function handleDeleteBudget(id) {
    await api.delete(`/budgets/${id}`);
    loadBudgets();
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const expenseItems = expenses.filter((e) => e.type === "expense");
  const filteredItems = timeframe === "month"
    ? expenseItems.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
    : expenseItems;

  const groupedCategory = {};
  filteredItems.forEach((e) => {
    const cat = e.category || "Other";
    if (!groupedCategory[cat]) {
      groupedCategory[cat] = { _id: cat, total: 0 };
    }
    groupedCategory[cat].total += e.amount;
  });
  
  const categoryBreakdown = Object.values(groupedCategory).sort(
    (a, b) => b.total - a.total
  );

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <span className="brand-mark">₹</span>
            <span className="brand-name">
              Expense<em>Flow</em>
            </span>
          </div>

          <div className="nav-actions">
            <button
              className="nav-btn income"
              onClick={() => setActiveForm("income")}
            >
              <span className="nav-btn-dot" /> Income
            </button>
            <button
              className="nav-btn expense"
              onClick={() => setActiveForm("expense")}
            >
              <span className="nav-btn-dot" /> Expense
            </button>

            <span className="nav-divider" />

            <div className="user-chip" title={user?.email}>
              <span className="avatar">{initial}</span>
              <span className="user-chip-name">{firstName}</span>
            </div>

            <button className="icon-btn" onClick={logout} title="Log out">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Hello, {firstName}</h1>
          <p className="subtitle">Your personal money command room.</p>
        </div>
      </header>

      {activeForm && (
        <section className="card">
          <ExpenseForm
            defaultType={activeForm}
            onSubmit={handleAdd}
            onCancel={() => setActiveForm(null)}
          />
        </section>
      )}

      <div className="summary-grid">
        <div className="summary-tile">
          <span className="label">Net balance</span>
          <span className="value">
            ₹{summary?.netBalance?.toFixed(0) || "0"}
          </span>
        </div>
        <div className="summary-tile">
          <span className="label">Income · month</span>
          <span className="value income">
            ₹{summary?.currentMonth?.income?.toFixed(0) || "0"}
          </span>
        </div>
        <div className="summary-tile">
          <span className="label">Expense · month</span>
          <span className="value expense">
            ₹{summary?.currentMonth?.expense?.toFixed(0) || "0"}
          </span>
        </div>
        <div className="summary-tile">
          <span className="label">Total budget</span>
          <span className="value">₹{totalBudget.toFixed(0)}</span>
        </div>
      </div>

      <div className="two-col">
        <section className="card chart-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <div>
                <h3>Income vs Expense</h3>
                <p className="chart-subtitle">This month's cash flow at a glance</p>
              </div>
            </div>
            <button className="chart-arrow-btn">↗</button>
          </div>
          <IncomeExpenseChart
            income={summary?.currentMonth?.income || 0}
            expense={summary?.currentMonth?.expense || 0}
          />
        </section>
        <section className="card chart-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <div>
                <h3>Expense breakdown</h3>
                <p className="chart-subtitle">Monitor how your money is being spent</p>
              </div>
            </div>
            <button className="chart-arrow-btn">↗</button>
          </div>
          
          <div className="chart-tabs">
            <button 
              className={timeframe === "month" ? "tab-btn active" : "tab-btn"}
              onClick={() => setTimeframe("month")}
            >
              Month
            </button>
            <button 
              className={timeframe === "all" ? "tab-btn active" : "tab-btn"}
              onClick={() => setTimeframe("all")}
            >
              All Time
            </button>
          </div>
          
          <ExpenseChart data={categoryBreakdown} />
        </section>
      </div>

      <section className="card">
        <h2>Monthly Cash Flow Trend</h2>
        <TrendChart data={summary?.byMonth} />
      </section>

      <BudgetSection
        budgets={budgets}
        onSetBudget={handleSetBudget}
        onDeleteBudget={handleDeleteBudget}
      />
      <section className="card">
        <h2>All transactions</h2>
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          activeFilter={typeFilter}
          onFilterChange={setTypeFilter}
        />
      </section>
    </div>
    </>
  );
}
