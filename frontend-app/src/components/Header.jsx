import React from "react";
import { useApp } from "../context/AppContext";

const pageTitles = {
  dashboard: { title: "Dashboard", sub: "Your financial overview" },
  transactions: { title: "Transactions", sub: "All your financial activity" },
  insights: { title: "Insights", sub: "Smart spending analysis" },
};

export default function Header({ setMobileOpen }) {
  const { state, dispatch } = useApp();
  const page = pageTitles[state.activePage];

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={() => setMobileOpen((p) => !p)}>
          ☰
        </button>
        <div>
          <h1 className="header__title">{page.title}</h1>
          <p className="header__sub">{page.sub}</p>
        </div>
      </div>

      <div className="header__right">
        <div className="header__role-chip">
          {state.role === "admin" ? "⚙ Admin" : "👁 Viewer"}
        </div>
        <button
          className="header__dark-btn"
          onClick={() => dispatch({ type: "TOGGLE_DARK" })}
          title="Toggle dark mode"
        >
          {state.darkMode ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}