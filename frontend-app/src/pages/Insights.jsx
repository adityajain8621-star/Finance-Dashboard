import React from "react";
import { useApp } from "../context/AppContext";
import { getCategoryBreakdown, getMonthlyData, CATEGORY_COLORS } from "../data/mockData";
import { formatCurrency } from "../utils/helpers";

export default function Insights() {
  const { state, totalIncome, totalExpense, balance } = useApp();
  const cats = getCategoryBreakdown(state.transactions);
  const monthly = getMonthlyData(state.transactions);

  const topCategory = cats[0];
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Month-over-month
  const lastTwo = monthly.slice(-2);
  const momChange =
    lastTwo.length === 2
      ? (((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense) * 100).toFixed(1)
      : null;

  const avgMonthlyExpense = monthly.length
    ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length
    : 0;
  const avgMonthlyIncome = monthly.length
    ? monthly.reduce((s, m) => s + m.income, 0) / monthly.length
    : 0;

  const maxBar = cats[0]?.amount || 1;

  return (
    <div className="page">
      {/* Insight cards */}
      <div className="insight-cards">
        <div className="insight-card insight-card--blue">
          <div className="insight-card__icon">◈</div>
          <div className="insight-card__label">Savings Rate</div>
          <div className="insight-card__value">{savingsRate}%</div>
          <div className="insight-card__sub">
            {savingsRate >= 20
              ? "Great savings habit!"
              : savingsRate >= 10
              ? "Room to improve"
              : "Try to save more"}
          </div>
        </div>

        <div className="insight-card insight-card--orange">
          <div className="insight-card__icon">▲</div>
          <div className="insight-card__label">Top Expense Category</div>
          <div className="insight-card__value" style={{ fontSize: "1.1rem" }}>
            {topCategory?.category || "—"}
          </div>
          <div className="insight-card__sub">
            {topCategory ? formatCurrency(topCategory.amount) : "No data"}
          </div>
        </div>

        <div className="insight-card insight-card--green">
          <div className="insight-card__icon">≈</div>
          <div className="insight-card__label">Avg Monthly Income</div>
          <div className="insight-card__value">{formatCurrency(avgMonthlyIncome)}</div>
          <div className="insight-card__sub">Across {monthly.length} months</div>
        </div>

        <div className={`insight-card ${momChange >= 0 ? "insight-card--red" : "insight-card--green"}`}>
          <div className="insight-card__icon">{momChange >= 0 ? "↑" : "↓"}</div>
          <div className="insight-card__label">Expense Change (MoM)</div>
          <div className="insight-card__value">
            {momChange !== null ? `${momChange > 0 ? "+" : ""}${momChange}%` : "—"}
          </div>
          <div className="insight-card__sub">vs last month</div>
        </div>
      </div>

      {/* Category breakdown chart */}
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Category Spending Breakdown</h3>
        </div>
        <div className="cat-breakdown">
          {cats.map((c) => (
            <div key={c.category} className="cat-row">
              <div className="cat-row__label">
                <span className="cat-row__dot" style={{ background: c.color }} />
                <span>{c.category}</span>
              </div>
              <div className="cat-row__bar-wrap">
                <div
                  className="cat-row__bar"
                  style={{
                    width: `${(c.amount / maxBar) * 100}%`,
                    background: c.color,
                  }}
                />
              </div>
              <div className="cat-row__amount">{formatCurrency(c.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly comparison */}
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Monthly Comparison</h3>
        </div>
        <div className="monthly-comparison">
          {monthly.map((m) => (
            <div key={m.month} className="month-row">
              <div className="month-row__label">{m.month}</div>
              <div className="month-row__bars">
                <div className="month-bar-wrap">
                  <div
                    className="month-bar month-bar--income"
                    style={{ width: `${(m.income / (avgMonthlyIncome * 1.5 || 1)) * 100}%` }}
                  />
                  <span className="month-bar__val amount--income">{formatCurrency(m.income)}</span>
                </div>
                <div className="month-bar-wrap">
                  <div
                    className="month-bar month-bar--expense"
                    style={{ width: `${(m.expense / (avgMonthlyExpense * 1.5 || 1)) * 100}%` }}
                  />
                  <span className="month-bar__val amount--expense">{formatCurrency(m.expense)}</span>
                </div>
              </div>
              <div className={`month-row__net ${m.net >= 0 ? "amount--income" : "amount--expense"}`}>
                {m.net >= 0 ? "+" : ""}{formatCurrency(m.net)}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-card__legend" style={{ marginTop: "16px" }}>
          <span className="legend-dot legend-dot--income" /> Income
          <span className="legend-dot legend-dot--expense" style={{ marginLeft: "16px" }} /> Expense
        </div>
      </div>

      {/* Observations */}
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Key Observations</h3>
        </div>
        <div className="observations">
          <div className="observation">
            <span className="observation__icon">💡</span>
            <span>
              Your top spending category is <strong>{topCategory?.category}</strong>, accounting for{" "}
              <strong>
                {cats.length > 0
                  ? ((topCategory.amount / totalExpense) * 100).toFixed(1)
                  : 0}
                %
              </strong>{" "}
              of total expenses.
            </span>
          </div>
          <div className="observation">
            <span className="observation__icon">{savingsRate >= 20 ? "✅" : "⚠️"}</span>
            <span>
              Your savings rate is <strong>{savingsRate}%</strong>.{" "}
              {savingsRate >= 20
                ? "Excellent! You're saving more than 20% of income."
                : "Aim to save at least 20% of your income."}
            </span>
          </div>
          {momChange !== null && (
            <div className="observation">
              <span className="observation__icon">{momChange > 0 ? "📈" : "📉"}</span>
              <span>
                Your expenses{" "}
                <strong>{momChange > 0 ? "increased" : "decreased"} by {Math.abs(momChange)}%</strong>{" "}
                compared to last month.
              </span>
            </div>
          )}
          <div className="observation">
            <span className="observation__icon">📊</span>
            <span>
              Average monthly expense is <strong>{formatCurrency(avgMonthlyExpense)}</strong>, while income
              averages <strong>{formatCurrency(avgMonthlyIncome)}</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}