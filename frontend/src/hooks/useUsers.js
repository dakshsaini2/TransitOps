import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import "../types";

export function useUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.role && filters.role !== "all") {
        queryParams.append("role", filters.role.toUpperCase());
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `api/users${queryString ? `?${queryString}` : ""}`;
      
      const result = await apiFetch(endpoint);
      setUsers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.role, filters.search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await apiFetch(`api/users/${id}`);
      setUser(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUserActions() {
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
    createUser: (data) => performAction("api/users", "POST", data),
    updateUser: (id, data) => performAction(`api/users/${id}`, "PUT", data),
    deleteUser: (id) => performAction(`api/users/${id}`, "DELETE"),
    toggleStatus: (id) => performAction(`api/users/${id}/toggle-status`, "POST"),
  };
}
