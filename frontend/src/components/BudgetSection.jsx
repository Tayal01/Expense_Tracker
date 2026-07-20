import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog.jsx";

// Shows the list of monthly budget caps with a progress bar for each,
// plus a small inline form to add a new one, and a delete option.
export default function BudgetSection({
  budgets,
  onSetBudget,
  onDeleteBudget,
}) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const now = new Date();
    onSetBudget({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      category: category || null,
      amount: Number(amount),
    });
    setCategory("");
    setAmount("");
    setShowForm(false);
  }

  function confirmDelete() {
    if (pendingDelete) {
      onDeleteBudget(pendingDelete._id);
      setPendingDelete(null);
    }
  }

  return (
    <section className="card">
      <div className="list-header">
        <h2>Monthly caps</h2>
        <button onClick={() => setShowForm((s) => !s)}>+ Set budget</button>
      </div>

      {showForm && (
        <form className="expense-form" onSubmit={handleSubmit}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Overall Budget</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            placeholder="Cap amount"
            value={amount}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit">Save</button>
        </form>
      )}

      {budgets.length === 0 ? (
        <p className="empty-state">No budgets set for this month yet.</p>
      ) : (
        <ul className="budget-list">
          {budgets.map((b) => {
            const pct = Math.min(100, Math.round((b.spent / b.amount) * 100));
            const over = b.spent > b.amount;
            return (
              <li key={b._id} className="budget-row">
                <div className="budget-label">
                  <span>{b.category || "Overall"}</span>
                  <div className="budget-label-right">
                    <span className={over ? "over" : ""}>
                      ₹{b.spent.toFixed(0)} / ₹{b.amount.toFixed(0)}
                    </span>
                    <button
                      className="ghost danger"
                      onClick={() => setPendingDelete(b)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="budget-bar-track">
                  <div
                    className={
                      over ? "budget-bar-fill over" : "budget-bar-fill"
                    }
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete budget?"
        message={
          pendingDelete
            ? `Remove the ${pendingDelete.category || "Overall"} budget cap of ₹${pendingDelete.amount.toFixed(0)}?`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
