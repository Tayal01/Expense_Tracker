import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// Renders the month-over-month income vs expense cash flow trend.
export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="empty-state">
        No transaction history available to display trend.
      </p>
    );
  }

  // Transform data of format:
  // _id: { year, month, type }
  // total: number
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const grouped = {};

  data.forEach((item) => {
    if (!item._id) return;
    const { year, month, type } = item._id;
    if (year === undefined || month === undefined) return;
    
    const label = `${monthNames[month - 1]} ${year}`;
    if (!grouped[label]) {
      grouped[label] = {
        name: label,
        Income: 0,
        Expense: 0,
        sortKey: year * 100 + month, // For correct chronological order
      };
    }
    if (type === "income") {
      grouped[label].Income += item.total;
    } else if (type === "expense") {
      grouped[label].Expense += item.total;
    }
  });

  const chartData = Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey);

  if (chartData.length === 0) {
    return (
      <p className="empty-state">
        No transaction history available to display trend.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a3e635" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
        <XAxis dataKey="name" stroke="#8b94a3" fontSize={11} />
        <YAxis stroke="#8b94a3" fontSize={11} />
        <Tooltip
          formatter={(value) => `₹${value.toFixed(2)}`}
          contentStyle={{ background: "#1c1f27", border: "1px solid #2a2f3a", borderRadius: "8px", color: "#e6e8ec" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        <Area
          type="monotone"
          dataKey="Income"
          stroke="#a3e635"
          fillOpacity={1}
          fill="url(#colorIncome)"
          strokeWidth={2.5}
        />
        <Area
          type="monotone"
          dataKey="Expense"
          stroke="#fb7185"
          fillOpacity={1}
          fill="url(#colorExpense)"
          strokeWidth={2.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
