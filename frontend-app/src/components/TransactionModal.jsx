import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import { generateId } from "../utils/helpers";

const empty = {
  description: "",
  amount: "",
  category: "Food & Dining",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionModal({ editData, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(editData || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editData || empty);
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Valid amount required";
    if (!form.date) e.date = "Date required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    const payload = { ...form, amount: Number(form.amount), id: editData ? editData.id : generateId() };
    dispatch({ type: editData ? "EDIT_TRANSACTION" : "ADD_TRANSACTION", payload });
    onClose();
  };

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{editData ? "Edit Transaction" : "Add Transaction"}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className={`form-input ${errors.description ? "form-input--error" : ""}`}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Monthly Salary"
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className={`form-input ${errors.amount ? "form-input--error" : ""}`}
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                min="0"
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className={`form-input ${errors.date ? "form-input--error" : ""}`}
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="type-toggle">
                <button
                  className={`type-btn ${form.type === "income" ? "type-btn--income" : ""}`}
                  onClick={() => set("type", "income")}
                >
                  ↑ Income
                </button>
                <button
                  className={`type-btn ${form.type === "expense" ? "type-btn--expense" : ""}`}
                  onClick={() => set("type", "expense")}
                >
                  ↓ Expense
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSubmit}>
            {editData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}