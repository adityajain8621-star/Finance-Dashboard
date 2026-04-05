import React from "react";
import SummaryCards from "../components/SummaryCards";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import RecentTransactions from "../components/RecentTransactions";

export default function Dashboard() {
  return (
    <div className="page">
      <SummaryCards />
      <div className="chart-grid">
        <BarChart />
        <DonutChart />
      </div>
      <RecentTransactions />
    </div>
  );
}