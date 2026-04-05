import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import "./App.css";

function AppContent() {
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pages = {
    dashboard: <Dashboard />,
    transactions: <Transactions />,
    insights: <Insights />,
  };

  return (
    <div className={`app-shell ${state.darkMode ? "dark" : ""}`}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="main-area">
        <Header setMobileOpen={setMobileOpen} />
        <main className="content">{pages[state.activePage]}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}