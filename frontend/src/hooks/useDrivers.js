import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import "../types";

/**
 * @param {Object} filters
 * @param {string} [filters.status]
 * @param {string} [filters.search]
 * @returns {{drivers: import('../types').Driver[], loading: boolean, error: string|null, refetch: function}}
 */
export function useDrivers(filters = {}) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string for filters
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status.toUpperCase());
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `api/drivers${queryString ? `?${queryString}` : ""}`;
      
      const result = await apiFetch(endpoint);
      setDrivers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return { drivers, loading, error, refetch: fetchDrivers };
}

/**
 * @param {number|string} id
 * @returns {{driver: import('../types').Driver|null, loading: boolean, error: string|null, refetch: function}}
 */
export function useDriver(id) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDriver = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch(`api/drivers/${id}`);
      setDriver(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDriver();
    }
  }, [fetchDriver, id]);

  return { driver, loading, error, refetch: fetchDriver };
}

export function useDriverActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createDriver = async (data) => {
    setActionLoading(true);
    try {
      const result = await apiFetch("api/drivers", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  const updateDriver = async (id, data) => {
    setActionLoading(true);
    try {
      const result = await apiFetch(`api/drivers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteDriver = async (id) => {
    setActionLoading(true);
    try {
      await apiFetch(`api/drivers/${id}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  return { actionLoading, createDriver, updateDriver, deleteDriver };
}

