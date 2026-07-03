import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Takes { income, expense } for the current month and renders a simple
// two-bar comparison chart.
export default function IncomeExpenseChart({ income = 0, expense = 0 }) {
  const data = [
    { name: "Income", value: income, fill: "#a3e635" },
    { name: "Expense", value: expense, fill: "#fb7185" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
        <XAxis dataKey="name" stroke="#8b94a3" />
        <YAxis stroke="#8b94a3" />
        <Tooltip
          formatter={(value) => `₹${value.toFixed(2)}`}
          contentStyle={{ background: "#1c1f27", border: "1px solid #2a2f3a" }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
