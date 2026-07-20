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

export default function ExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="empty-state">
        Add some expenses to see your spending breakdown.
      </p>
    );
  }

  const chartData = data.map((d) => ({ name: d._id, value: d.total }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null; // Hide labels on very small slices to prevent overlap

    // Calculate center point of the thicker donut ring
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {/* Draw a rounded pill background for the text */}
        <rect
          x={x - 18}
          y={y - 8}
          width={36}
          height={16}
          rx={8}
          fill="#ffffff"
          style={{ filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))" }}
        />
        <text
          x={x}
          y={y}
          fill="#0d0f14"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: "10px", fontWeight: "700" }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="custom-legend">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="legend-item">
            <span
              className="legend-color-dot"
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-label">{entry.payload.name}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="65%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={4}
          cornerRadius={6}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `₹${value.toFixed(2)}`}
          contentStyle={{
            background: "#171a21",
            border: "1px solid #262b36",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
          itemStyle={{
            color: "#e6e8ec",
            fontSize: "12px",
            fontWeight: "600",
          }}
        />
        <Legend
          content={renderCustomLegend}
          layout="vertical"
          verticalAlign="middle"
          align="left"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
