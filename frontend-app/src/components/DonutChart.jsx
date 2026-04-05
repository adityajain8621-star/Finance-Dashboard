import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getCategoryBreakdown } from "../data/mockData";
import { formatCurrency } from "../utils/helpers";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function DonutChart() {
  const { state } = useApp();
  const [hovered, setHovered] = useState(null);
  const data = getCategoryBreakdown(state.transactions);
  const total = data.reduce((s, d) => s + d.amount, 0);

  const cx = 100, cy = 100, outerR = 80, innerR = 52;
  let currentAngle = 0;

  const slices = data.map((d) => {
    const angle = (d.amount / total) * 360;
    const slice = {
      ...d,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      pct: ((d.amount / total) * 100).toFixed(1),
    };
    currentAngle += angle;
    return slice;
  });

  const hov = hovered !== null ? slices[hovered] : null;

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Spending Breakdown</h3>
      </div>

      <div className="donut-layout">
        <div className="donut-svg-wrap">
          <svg viewBox="0 0 200 200" width={180} height={180}>
            {slices.map((slice, i) => (
              <path
                key={slice.category}
                d={describeArc(cx, cy, outerR, slice.startAngle, slice.endAngle)}
                stroke={slice.color}
                strokeWidth={hovered === i ? 26 : 20}
                strokeLinecap="butt"
                fill="none"
                opacity={hovered === null || hovered === i ? 1 : 0.4}
                style={{ transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            {/* Center text */}
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.6}>
              {hov ? hov.category.split(" ")[0] : "Total"}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
              {hov ? `${hov.pct}%` : `${slices.length}`}
            </text>
            <text x={cx} y={cy + 26} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.5}>
              {hov ? formatCurrency(hov.amount) : "categories"}
            </text>
          </svg>
        </div>

        <div className="donut-legend">
          {slices.slice(0, 6).map((s, i) => (
            <div
              key={s.category}
              className={`donut-legend__item ${hovered === i ? "donut-legend__item--active" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="donut-legend__dot" style={{ background: s.color }} />
              <span className="donut-legend__name">{s.category}</span>
              <span className="donut-legend__pct">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}