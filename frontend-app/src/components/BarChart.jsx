import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getMonthlyData } from "../data/mockData";
import { formatCurrency } from "../utils/helpers";

export default function BarChart() {
  const { state } = useApp();
  const [tooltip, setTooltip] = useState(null);
  const data = getMonthlyData(state.transactions);

  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense))) || 1;
  const chartH = 180;
  const barW = 28;
  const gap = 12;
  const groupW = barW * 2 + gap + 24;
  const totalW = data.length * groupW;

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Monthly Overview</h3>
        <div className="chart-card__legend">
          <span className="legend-dot legend-dot--income" /> Income
          <span className="legend-dot legend-dot--expense" /> Expense
        </div>
      </div>

      <div className="chart-scroll">
        <svg width={Math.max(totalW, 300)} height={chartH + 40} style={{ overflow: "visible" }}>
          {data.map((d, i) => {
            const x = i * groupW + 12;
            const incomeH = (d.income / maxVal) * chartH;
            const expenseH = (d.expense / maxVal) * chartH;

            return (
              <g key={d.month}>
                {/* Income bar */}
                <rect
                  x={x}
                  y={chartH - incomeH}
                  width={barW}
                  height={incomeH}
                  rx={4}
                  fill="#22c55e"
                  opacity={0.85}
                  className="chart-bar"
                  onMouseEnter={(e) =>
                    setTooltip({ x: e.clientX, y: e.clientY, label: `Income: ${formatCurrency(d.income)}`, month: d.month })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Expense bar */}
                <rect
                  x={x + barW + gap}
                  y={chartH - expenseH}
                  width={barW}
                  height={expenseH}
                  rx={4}
                  fill="#ef4444"
                  opacity={0.85}
                  className="chart-bar"
                  onMouseEnter={(e) =>
                    setTooltip({ x: e.clientX, y: e.clientY, label: `Expense: ${formatCurrency(d.expense)}`, month: d.month })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Month label */}
                <text
                  x={x + barW + gap / 2}
                  y={chartH + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  opacity={0.6}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={0}
              x2={totalW}
              y1={chartH * (1 - pct)}
              y2={chartH * (1 - pct)}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeDasharray="4 4"
            />
          ))}
        </svg>
      </div>

      {tooltip && (
        <div
          className="chart-tooltip"
          style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
        >
          <div className="chart-tooltip__month">{tooltip.month}</div>
          <div>{tooltip.label}</div>
        </div>
      )}
    </div>
  );
}