# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React JS and plain JavaScript (no TypeScript). Features role-based UI, charts, filtering, and dark mode — all with zero external chart libraries (pure SVG).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Bundler | Vite |
| Styling | Plain CSS (CSS Variables) |
| State | React Context + useReducer |
| Charts | Custom SVG (no recharts/chart.js) |
| Persistence | localStorage |

---

## Features

### Dashboard Overview
- **4 Summary Cards** — Total Balance, Income, Expenses, Net Savings with savings rate
- **Monthly Bar Chart** — Income vs Expense per month (custom SVG with hover tooltips)
- **Spending Donut Chart** — Category breakdown with interactive hover legend
- **Recent Transactions** — Last 6 transactions with quick-view link

### Transactions Page
- Full sortable table (click any column header)
- Filter by **type** (income/expense), **category**, and **search**
- Stats bar showing filtered totals
- **Export to CSV** button
- Admin-only: Add, Edit, Delete transactions

### Insights Page
- Savings rate with health indicator
- Top spending category
- Month-over-month expense change
- Horizontal bar chart for category breakdown
- Monthly income vs expense comparison
- Key observations panel

### Role-Based UI (RBAC Simulation)
| Feature | Viewer | Admin |
|---------|--------|-------|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

Switch roles using the **sidebar dropdown** — changes take effect instantly.

### Additional Features
- **Dark Mode** — Toggle via moon/sun button in header, persisted to localStorage
- **Data Persistence** — All transactions saved to localStorage
- **Responsive Design** — Mobile hamburger menu, adaptive grid layouts
- **Empty State Handling** — Graceful UI when no data matches filters
- **Form Validation** — Add/Edit modal with inline error messages

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx      # Global state (useReducer + Context)
├── data/
│   └── mockData.js         # 34 mock transactions, colors, helpers
├── utils/
│   └── helpers.js          # formatCurrency, formatDate, generateId
├── components/
│   ├── Sidebar.jsx         # Navigation + role switcher
│   ├── Header.jsx          # Page title + dark mode toggle
│   ├── SummaryCards.jsx    # 4 KPI cards
│   ├── BarChart.jsx        # Monthly SVG bar chart
│   ├── DonutChart.jsx      # Category SVG donut chart
│   ├── RecentTransactions.jsx
│   └── TransactionModal.jsx # Add/Edit modal with validation
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Insights.jsx
├── App.jsx
├── App.css                 # All styles (CSS variables, responsive)
└── main.jsx
```

---

## Setup & Run

```bash
# 1. Clone or unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## State Management Approach

Used **React Context + useReducer** — the right tool for this scale:

- `AppContext.jsx` holds all global state: transactions, role, darkMode, filters, sortBy/sortDir, activePage
- `dispatch` actions: `SET_ROLE`, `TOGGLE_DARK`, `SET_PAGE`, `SET_FILTER`, `SET_SORT`, `ADD_TRANSACTION`, `EDIT_TRANSACTION`, `DELETE_TRANSACTION`
- Derived values (filteredTransactions, totals) computed inside the provider and passed via context
- `localStorage` sync handled in a single `useEffect`

No Redux needed — Context is sufficient and keeps the codebase simple.

---

## Design Decisions

- **No external chart libraries** — All charts are hand-crafted SVG for zero bundle bloat and full control
- **DM Sans + DM Mono** fonts — Clean, modern, pairs beautifully for numbers
- **CSS Variables** — One set of variables for light/dark, zero JS theme logic
- **INR currency** — Locale-aware formatting with `Intl.NumberFormat`
- **34 mock transactions** across 3 months for realistic data variety

---

## Assumptions

- Authentication is out of scope; role switching is UI-only for demonstration
- All data is mock/static; no real API calls
- Currency is INR (easily changeable in `utils/helpers.js`)
