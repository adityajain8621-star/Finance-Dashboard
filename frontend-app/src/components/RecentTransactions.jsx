import React from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency, formatDate } from "../utils/helpers";
import { CATEGORY_COLORS } from "../data/mockData";

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Recent Transactions</h3>
        <button
          className="chart-card__link"
          onClick={() => dispatch({ type: "SET_PAGE", payload: "transactions" })}
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">No transactions yet</div>
      ) : (
        <div className="recent-list">
          {recent.map((t) => (
            <div key={t.id} className="recent-item">
              <div
                className="recent-item__icon"
                style={{ background: CATEGORY_COLORS[t.category] + "22", color: CATEGORY_COLORS[t.category] }}
              >
                {t.type === "income" ? "↑" : "↓"}
              </div>
              <div className="recent-item__info">
                <div className="recent-item__desc">{t.description}</div>
                <div className="recent-item__meta">{t.category} · {formatDate(t.date)}</div>
              </div>
              <div className={`recent-item__amount ${t.type === "income" ? "amount--income" : "amount--expense"}`}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}