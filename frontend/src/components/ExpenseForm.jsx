import React, { useState } from "react";

const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];

export default function ExpenseForm({
  onSubmit,
  initialData,
  onCancel,
  defaultType = "expense",
}) {
  const [type, setType] = useState(initialData?.type || defaultType);
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [category, setCategory] = useState(initialData?.category || "Other");
  const [date, setDate] = useState(
    initialData?.date
      ? initialData.date.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleSubmit(e) {
    e.preventDefault();
    // We still send a `title` to the backend (it's a required field in the
    // Expense schema), but we just reuse the category as the title since
    // there's no separate description input anymore.
    onSubmit({ title: category, amount: Number(amount), category, date, type });
    if (!initialData) {
      setAmount("");
      setCategory("Other");
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {!initialData && (
        <div className="type-toggle">
          <button
            type="button"
            className={
              type === "expense" ? "toggle-btn active expense" : "toggle-btn"
            }
            onClick={() => {
              setType("expense");
              setCategory("Other");
            }}
          >
            − Expense
          </button>
          <button
            type="button"
            className={
              type === "income" ? "toggle-btn active income" : "toggle-btn"
            }
            onClick={() => {
              setType("income");
              setCategory("Other");
            }}
          >
            + Income
          </button>
        </div>
      )}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        min="0"
        step="0.01"
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className="form-actions">
        <button
          type="submit"
          className={type === "income" ? "income" : "expense"}
        >
          {initialData
            ? "Save changes"
            : type === "income"
              ? "Add income"
              : "Add expense"}
        </button>
        {initialData && (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
