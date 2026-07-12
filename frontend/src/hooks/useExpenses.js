import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
let MOCK_EXPENSES = [
  { id: "E-101", date: "2026-07-05", category: "Tolls", amount: 1500, description: "Mumbai-Pune Expressway Tolls", tripId: "TRP-2023001" },
  { id: "E-102", date: "2026-07-06", category: "Food & Lodging", amount: 2500, description: "Driver night halt", tripId: "TRP-2023002" },
  { id: "E-103", date: "2026-07-08", category: "Permits", amount: 4500, description: "Inter-state border permit", tripId: "TRP-2023004" },
  { id: "E-104", date: "2026-07-10", category: "Miscellaneous", amount: 800, description: "Parking fees", tripId: "TRP-2023005" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(350);
      let result = [...MOCK_EXPENSES];

      if (filters.category && filters.category !== "all") {
        result = result.filter((e) => e.category === filters.category);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (e) =>
            e.description.toLowerCase().includes(q) ||
            e.id.toLowerCase().includes(q) ||
            (e.tripId && e.tripId.toLowerCase().includes(q))
        );
      }
      setExpenses(result.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, error, refetch: fetchExpenses };
}

export function useExpenseActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createExpense = async (data) => {
    setActionLoading(true);
    await delay(600);
    const newExpense = {
      id: `E-${(MOCK_EXPENSES.length + 101).toString()}`,
      ...data,
      amount: Number(data.amount) || 0,
    };
    MOCK_EXPENSES = [newExpense, ...MOCK_EXPENSES];
    setActionLoading(false);
    return { success: true, data: newExpense };
  };

  const deleteExpense = async (id) => {
    setActionLoading(true);
    await delay(600);
    MOCK_EXPENSES = MOCK_EXPENSES.filter((e) => e.id !== id);
    setActionLoading(false);
    return { success: true };
  };

  return { actionLoading, createExpense, deleteExpense };
}
