import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import "../types";

export function useFuelLogs(filters = {}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      if (filters.vehicleId) {
        queryParams.append("vehicle_id", filters.vehicleId);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `api/fuel-logs${queryString ? `?${queryString}` : ""}`;
      
      const result = await apiFetch(endpoint);
      setLogs(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.vehicleId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

export function useFuelLog(id) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(`api/fuel-logs/${id}`);
      setLog(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  return { log, loading, error, refetch: fetchLog };
}
export function useFuelActions() {
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
    createLog: (data) => performAction("api/fuel-logs", "POST", data),
    updateLog: (id, data) => performAction(`api/fuel-logs/${id}`, "PUT", data),
    deleteLog: (id) => performAction(`api/fuel-logs/${id}`, "DELETE"),
  };
}
