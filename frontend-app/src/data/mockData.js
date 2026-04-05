export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Salary",
  "Freelance",
  "Investment",
  "Rent",
];

export const CATEGORY_COLORS = {
  "Food & Dining": "#f97316",
  Transport: "#3b82f6",
  Shopping: "#ec4899",
  Entertainment: "#a855f7",
  Health: "#22c55e",
  Utilities: "#eab308",
  Salary: "#14b8a6",
  Freelance: "#06b6d4",
  Investment: "#6366f1",
  Rent: "#ef4444",
};

export const initialTransactions = [
  { id: 1, date: "2024-01-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 2, date: "2024-01-06", description: "Grocery Store", amount: 2400, category: "Food & Dining", type: "expense" },
  { id: 3, date: "2024-01-08", description: "Uber Ride", amount: 350, category: "Transport", type: "expense" },
  { id: 4, date: "2024-01-10", description: "Netflix Subscription", amount: 649, category: "Entertainment", type: "expense" },
  { id: 5, date: "2024-01-12", description: "Freelance Project", amount: 18000, category: "Freelance", type: "income" },
  { id: 6, date: "2024-01-14", description: "Electricity Bill", amount: 1800, category: "Utilities", type: "expense" },
  { id: 7, date: "2024-01-15", description: "Amazon Shopping", amount: 3200, category: "Shopping", type: "expense" },
  { id: 8, date: "2024-01-18", description: "Gym Membership", amount: 1200, category: "Health", type: "expense" },
  { id: 9, date: "2024-01-20", description: "Stock Dividend", amount: 5500, category: "Investment", type: "income" },
  { id: 10, date: "2024-01-22", description: "House Rent", amount: 15000, category: "Rent", type: "expense" },
  { id: 11, date: "2024-01-25", description: "Restaurant Dinner", amount: 1800, category: "Food & Dining", type: "expense" },
  { id: 12, date: "2024-01-28", description: "Metro Pass", amount: 500, category: "Transport", type: "expense" },
  { id: 13, date: "2024-02-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 14, date: "2024-02-07", description: "Grocery Store", amount: 2900, category: "Food & Dining", type: "expense" },
  { id: 15, date: "2024-02-09", description: "Ola Cab", amount: 420, category: "Transport", type: "expense" },
  { id: 16, date: "2024-02-11", description: "Clothing Purchase", amount: 4500, category: "Shopping", type: "expense" },
  { id: 17, date: "2024-02-14", description: "Doctor Visit", amount: 800, category: "Health", type: "expense" },
  { id: 18, date: "2024-02-15", description: "Freelance Design", amount: 12000, category: "Freelance", type: "income" },
  { id: 19, date: "2024-02-18", description: "Internet Bill", amount: 999, category: "Utilities", type: "expense" },
  { id: 20, date: "2024-02-20", description: "Movie Tickets", amount: 600, category: "Entertainment", type: "expense" },
  { id: 21, date: "2024-02-22", description: "House Rent", amount: 15000, category: "Rent", type: "expense" },
  { id: 22, date: "2024-02-25", description: "Mutual Fund", amount: 8000, category: "Investment", type: "income" },
  { id: 23, date: "2024-02-28", description: "Swiggy Order", amount: 650, category: "Food & Dining", type: "expense" },
  { id: 24, date: "2024-03-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 25, date: "2024-03-07", description: "Grocery Store", amount: 3100, category: "Food & Dining", type: "expense" },
  { id: 26, date: "2024-03-10", description: "Flight Ticket", amount: 6500, category: "Transport", type: "expense" },
  { id: 27, date: "2024-03-12", description: "Freelance Dev", amount: 22000, category: "Freelance", type: "income" },
  { id: 28, date: "2024-03-15", description: "Electricity Bill", amount: 2100, category: "Utilities", type: "expense" },
  { id: 29, date: "2024-03-18", description: "Pharmacy", amount: 450, category: "Health", type: "expense" },
  { id: 30, date: "2024-03-20", description: "Spotify Premium", amount: 119, category: "Entertainment", type: "expense" },
  { id: 31, date: "2024-03-22", description: "House Rent", amount: 15000, category: "Rent", type: "expense" },
  { id: 32, date: "2024-03-25", description: "Electronics", amount: 8900, category: "Shopping", type: "expense" },
  { id: 33, date: "2024-03-28", description: "Stock Profit", amount: 11000, category: "Investment", type: "income" },
  { id: 34, date: "2024-03-30", description: "Zomato Order", amount: 480, category: "Food & Dining", type: "expense" },
];

export const getMonthlyData = (transactions) => {
  const months = {};
  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!months[month]) months[month] = { income: 0, expense: 0 };
    if (t.type === "income") months[month].income += t.amount;
    else months[month].expense += t.amount;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      ...data,
      net: data.income - data.expense,
    }));
};

export const getCategoryBreakdown = (transactions) => {
  const cats = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
  return Object.entries(cats)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount, color: CATEGORY_COLORS[category] || "#888" }));
};