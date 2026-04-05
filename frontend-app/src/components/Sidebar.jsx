import React from "react";
import { useApp } from "../context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "↕" },
  { id: "insights", label: "Insights", icon: "◎" },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">₹</div>
          <div>
            <div className="sidebar__logo-title">FinTrack</div>
            <div className="sidebar__logo-sub">Finance Dashboard</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__nav-item ${state.activePage === item.id ? "sidebar__nav-item--active" : ""}`}
              onClick={() => {
                dispatch({ type: "SET_PAGE", payload: item.id });
                setMobileOpen(false);
              }}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__role">
          <div className="sidebar__role-label">Role</div>
          <select
            className="sidebar__role-select"
            value={state.role}
            onChange={(e) => dispatch({ type: "SET_ROLE", payload: e.target.value })}
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">⚙ Admin</option>
          </select>
          <div className="sidebar__role-badge">
            {state.role === "admin" ? "Can add & edit" : "Read only"}
          </div>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__footer-text">v1.0.0</div>
        </div>
      </aside>
    </>
  );
}