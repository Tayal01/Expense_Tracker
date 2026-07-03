import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import ExpenseChart from "../components/ExpenseChart.jsx";
import IncomeExpenseChart from "../components/IncomeExpenseChart.jsx";
import BudgetSection from "../components/BudgetSection.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [typeFilter, setTypeFilter] = useState(""); // '', 'income', 'expense'
  const [activeForm, setActiveForm] = useState(null); // null | 'income' | 'expense'

  useEffect(() => {
    loadExpenses();
  }, [typeFilter]);

  useEffect(() => {
    loadSummary();
    loadBudgets();
  }, [expenses]);

  async function loadExpenses() {
    const params = typeFilter ? { type: typeFilter } : {};
    const { data } = await api.get("/expenses", { params });
    setExpenses(data);
  }

  async function loadSummary() {
    const { data } = await api.get("/expenses/analytics/summary");
    setSummary(data);
  }

  async function loadBudgets() {
    const { data } = await api.get("/budgets");
    setBudgets(data);
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

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Hello, {user?.name}</h1>
          <p className="subtitle">Your personal money command room.</p>
        </div>
        <div className="header-actions">
          <button className="income" onClick={() => setActiveForm("income")}>
            + Add Income
          </button>
          <button className="expense" onClick={() => setActiveForm("expense")}>
            − Add Expense
          </button>
          <button className="ghost" onClick={logout}>
            Log out
          </button>
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
        <section className="card">
          <h2>Income vs Expense</h2>
          <IncomeExpenseChart
            income={summary?.currentMonth?.income || 0}
            expense={summary?.currentMonth?.expense || 0}
          />
        </section>
        <section className="card">
          <h2>Expense breakdown by category</h2>
          <ExpenseChart data={summary?.byCategory} />
        </section>
      </div>

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
  );
}
