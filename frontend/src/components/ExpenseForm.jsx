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
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(
    initialData?.date
      ? initialData.date.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleSubmit(e) {
    e.preventDefault();
    // We send the custom note/description as `title`. If empty, fallback to the category.
    onSubmit({ title: title.trim() || category, amount: Number(amount), category, date, type });
    if (!initialData) {
      setAmount("");
      setCategory("Other");
      setTitle("");
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
        type="text"
        placeholder="Note / Description"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
