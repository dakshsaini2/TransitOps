import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import "../types";

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== "all") {
        queryParams.append("expense_type", filters.category.toUpperCase());
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      if (filters.vehicleId) {
        queryParams.append("vehicle_id", filters.vehicleId);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `api/expenses${queryString ? `?${queryString}` : ""}`;
      
      const result = await apiFetch(endpoint);
      setExpenses(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search, filters.vehicleId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, error, refetch: fetchExpenses };
}

export function useExpense(id) {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpense = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(`api/expenses/${id}`);
      setExpense(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  return { expense, loading, error, refetch: fetchExpense };
}
export function useExpenseActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const performAction = async (endpoint, method = "POST", data = null) => {
    setActionLoading(true);
    try {
      const result = await apiFetch(endpoint, {
        method,
        body: data ? JSON.stringify(data) : undefined,
      });
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    createExpense: (data) => performAction("api/expenses", "POST", data),
    updateExpense: (id, data) => performAction(`api/expenses/${id}`, "PUT", data),
    deleteExpense: (id) => performAction(`api/expenses/${id}`, "DELETE"),
  };
}
