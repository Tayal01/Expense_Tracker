import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inrCompact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

// Deeper steps of the brand lime/rose, tuned for the dark card surface
// (contrast + colorblind separation validated); the brighter brand tints
// stay on the text-level chips above the plot.
const BAR_COLORS = { income: "#67a60e", expense: "#e11d48" };

// Current month's income vs expense as thin rounded bars with direct labels.
export default function IncomeExpenseChart({ income = 0, expense = 0 }) {
  const data = [
    { name: "Income", key: "income", value: income },
    { name: "Expense", key: "expense", value: expense },
  ];

  if (income === 0 && expense === 0) {
    return (
      <p className="empty-state">
        No transactions this month yet. Add one to see your cash flow.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 24, right: 8, left: -8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#20242f" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8b94a3", fontSize: 12 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={44}
            tick={{ fill: "#5a6270", fontSize: 11 }}
            tickFormatter={(v) => inrCompact.format(v)}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
            formatter={(value) => [`₹${inr.format(value)}`, "This month"]}
            contentStyle={{
              background: "#1c1f27",
              border: "1px solid #2a2f3a",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            }}
            itemStyle={{ color: "#e6e8ec", fontSize: 12, fontWeight: 600 }}
            labelStyle={{ color: "#8b94a3", fontSize: 11 }}
          />
          <Bar
            dataKey="value"
            maxBarSize={56}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.key} fill={BAR_COLORS[d.key]} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => `₹${inrCompact.format(v)}`}
              fill="#e6e8ec"
              fontSize={12}
              fontWeight={700}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
  );
}
