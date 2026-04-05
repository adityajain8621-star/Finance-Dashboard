import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, CATEGORY_COLORS } from "../data/mockData";
import { formatCurrency, formatDate } from "../utils/helpers";
import TransactionModal from "../components/TransactionModal";

export default function Transactions() {
  const { state, dispatch, filteredTransactions } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const isAdmin = state.role === "admin";

  const handleEdit = (t) => {
    setEditData(t);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    setDeleteId(null);
  };

  const sortIcon = (field) => {
    if (state.sortBy !== field) return "⇅";
    return state.sortDir === "asc" ? "↑" : "↓";
  };

  const exportCSV = () => {
    const header = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filteredTransactions.map((t) => [
      t.date, t.description, t.category, t.type, t.amount,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="page">
      {/* Filters */}
      <div className="filters-bar">
        <input
          className="filter-input"
          placeholder="🔍 Search transactions..."
          value={state.filters.search}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })}
        />
        <select
          className="filter-select"
          value={state.filters.type}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { type: e.target.value } })}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="filter-select"
          value={state.filters.category}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="filters-bar__actions">
          <button className="btn btn--ghost btn--sm" onClick={exportCSV}>⬇ Export CSV</button>
          {isAdmin && (
            <button
              className="btn btn--primary btn--sm"
              onClick={() => { setEditData(null); setShowModal(true); }}
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="txn-stats">
        <span>{filteredTransactions.length} transactions</span>
        <span className="amount--income">
          Income: {formatCurrency(filteredTransactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0))}
        </span>
        <span className="amount--expense">
          Expense: {formatCurrency(filteredTransactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0))}
        </span>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">◎</div>
            <div>No transactions found</div>
            <div className="empty-state__sub">Try adjusting your filters</div>
          </div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                {[
                  { label: "Date", field: "date" },
                  { label: "Description", field: "description" },
                  { label: "Category", field: "category" },
                  { label: "Type", field: "type" },
                  { label: "Amount", field: "amount" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="txn-table__th"
                    onClick={() => dispatch({ type: "SET_SORT", payload: field })}
                  >
                    {label} <span className="sort-icon">{sortIcon(field)}</span>
                  </th>
                ))}
                {isAdmin && <th className="txn-table__th">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="txn-table__row">
                  <td className="txn-table__td txn-date">{formatDate(t.date)}</td>
                  <td className="txn-table__td txn-desc">{t.description}</td>
                  <td className="txn-table__td">
                    <span
                      className="category-chip"
                      style={{
                        background: CATEGORY_COLORS[t.category] + "20",
                        color: CATEGORY_COLORS[t.category],
                        borderColor: CATEGORY_COLORS[t.category] + "40",
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="txn-table__td">
                    <span className={`type-chip ${t.type === "income" ? "type-chip--income" : "type-chip--expense"}`}>
                      {t.type === "income" ? "↑" : "↓"} {t.type}
                    </span>
                  </td>
                  <td className={`txn-table__td txn-amount ${t.type === "income" ? "amount--income" : "amount--expense"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="txn-table__td">
                      <div className="txn-actions">
                        <button className="action-btn action-btn--edit" onClick={() => handleEdit(t)}>✎</button>
                        <button className="action-btn action-btn--delete" onClick={() => setDeleteId(t.id)}>✕</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Delete Transaction?</h2>
            </div>
            <div className="modal__body">
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal__footer">
              <button className="btn btn--ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn--danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <TransactionModal
          editData={editData}
          onClose={() => { setShowModal(false); setEditData(null); }}
        />
      )}
    </div>
  );
}