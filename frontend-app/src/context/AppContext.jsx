import React, { createContext, useContext, useReducer, useEffect } from "react";
import { initialTransactions } from "../data/mockData";

const AppContext = createContext();

const initialState = {
  transactions: JSON.parse(localStorage.getItem("fd_transactions")) || initialTransactions,
  role: localStorage.getItem("fd_role") || "viewer",
  darkMode: localStorage.getItem("fd_dark") === "true" || false,
  filters: { type: "all", category: "all", search: "" },
  sortBy: "date",
  sortDir: "desc",
  activePage: "dashboard",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };
    case "SET_PAGE":
      return { ...state, activePage: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload,
        sortDir: state.sortBy === action.payload && state.sortDir === "desc" ? "asc" : "desc",
      };
    case "ADD_TRANSACTION":
      const newTransactions = [action.payload, ...state.transactions];
      return { ...state, transactions: newTransactions };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("fd_transactions", JSON.stringify(state.transactions));
    localStorage.setItem("fd_role", state.role);
    localStorage.setItem("fd_dark", state.darkMode);
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.transactions, state.role, state.darkMode]);

  const filteredTransactions = state.transactions
    .filter((t) => {
      if (state.filters.type !== "all" && t.type !== state.filters.type) return false;
      if (state.filters.category !== "all" && t.category !== state.filters.category) return false;
      if (
        state.filters.search &&
        !t.description.toLowerCase().includes(state.filters.search.toLowerCase()) &&
        !t.category.toLowerCase().includes(state.filters.search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let valA = a[state.sortBy];
      let valB = b[state.sortBy];
      if (state.sortBy === "date") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return state.sortDir === "asc" ? -1 : 1;
      if (valA > valB) return state.sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <AppContext.Provider
      value={{ state, dispatch, filteredTransactions, totalIncome, totalExpense, balance }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);