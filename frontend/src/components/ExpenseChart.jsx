import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#f97316",
  "#10b981",
  "#ec4899",
  "#eab308",
  "#06b6d4",
  "#8b5cf6",
];

// Takes the `byCategory` array from the /analytics/summary endpoint
// and renders it as a pie chart - this is the "data visualization"
// piece referenced on the resume.
export default function ExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="empty-state">
        Add some expenses to see your spending breakdown.
      </p>
    );
  }

  const chartData = data.map((d) => ({ name: d._id, value: d.total }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
