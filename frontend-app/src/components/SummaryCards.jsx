import React from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/helpers";

export default function SummaryCards() {
  const { balance, totalIncome, totalExpense, state } = useApp();
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance),
      icon: "◈",
      color: "card--balance",
      sub: `Savings rate: ${savingsRate}%`,
      trend: balance > 0 ? "+" : "",
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: "↑",
      color: "card--income",
      sub: `${state.transactions.filter((t) => t.type === "income").length} transactions`,
      trend: "+",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpense),
      icon: "↓",
      color: "card--expense",
      sub: `${state.transactions.filter((t) => t.type === "expense").length} transactions`,
      trend: "-",
    },
    {
      label: "Net Savings",
      value: formatCurrency(Math.abs(balance)),
      icon: "◉",
      color: balance >= 0 ? "card--savings" : "card--negative",
      sub: balance >= 0 ? "You're in the green!" : "Overspent",
      trend: balance >= 0 ? "+" : "-",
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => (
        <div key={i} className={`summary-card ${card.color}`}>
          <div className="summary-card__header">
            <span className="summary-card__icon">{card.icon}</span>
            <span className="summary-card__label">{card.label}</span>
          </div>
          <div className="summary-card__value">{card.value}</div>
          <div className="summary-card__sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}