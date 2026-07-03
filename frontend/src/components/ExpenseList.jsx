import React, { useState } from "react";
import ExpenseForm from "./ExpenseForm.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function ExpenseList({
  expenses,
  onDelete,
  onUpdate,
  activeFilter,
  onFilterChange,
}) {
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  function confirmDelete() {
    if (pendingDelete) {
      onDelete(pendingDelete._id);
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <div className="filter-tabs">
        {["", "income", "expense"].map((f) => (
          <button
            key={f || "all"}
            className={activeFilter === f ? "tab active" : "tab"}
            onClick={() => onFilterChange(f)}
          >
            {f === "" ? "All" : f === "income" ? "Income" : "Expense"}
          </button>
        ))}
      </div>

      {expenses.length === 0 ? (
        <p className="empty-state">No transactions yet.</p>
      ) : (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Note</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) =>
              editingId === exp._id ? (
                <tr key={exp._id}>
                  <td colSpan={6}>
                    <ExpenseForm
                      initialData={exp}
                      onCancel={() => setEditingId(null)}
                      onSubmit={(updated) => {
                        onUpdate(exp._id, updated);
                        setEditingId(null);
                      }}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`type-badge ${exp.type}`}>
                      {exp.type === "income" ? "↗ Income" : "↘ Expense"}
                    </span>
                  </td>
                  <td>{exp.category}</td>
                  <td className="note-cell">{exp.title}</td>
                  <td
                    className={
                      exp.type === "income" ? "amount income" : "amount expense"
                    }
                  >
                    {exp.type === "income" ? "+" : "−"}₹{exp.amount.toFixed(2)}
                  </td>
                  <td>
                    <div className="expense-actions">
                      <button
                        className="ghost"
                        onClick={() => setEditingId(exp._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="ghost danger"
                        onClick={() => setPendingDelete(exp)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete transaction?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.title}" (₹${pendingDelete.amount.toFixed(2)})? This can't be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
