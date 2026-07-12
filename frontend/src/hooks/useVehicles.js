import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import "../types";

/**
 * @param {Object} filters
 * @param {string} [filters.status]
 * @param {string} [filters.search]
 * @returns {{vehicles: import('../types').Vehicle[], loading: boolean, error: string|null, refetch: function}}
 */
export function useVehicles(filters = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
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
      const endpoint = `api/vehicles${queryString ? `?${queryString}` : ""}`;
      
      const result = await apiFetch(endpoint);
      setVehicles(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

/**
 * @param {number|string} id
 * @returns {{vehicle: import('../types').Vehicle|null, loading: boolean, error: string|null, refetch: function}}
 */
export function useVehicle(id) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch(`api/vehicles/${id}`);
      setVehicle(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [fetchVehicle, id]);

  return { vehicle, loading, error, refetch: fetchVehicle };
}

export function useVehicleActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createVehicle = async (data) => {
    setActionLoading(true);
    try {
      const result = await apiFetch("api/vehicles", {
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

  const updateVehicle = async (id, data) => {
    setActionLoading(true);
    try {
      const result = await apiFetch(`api/vehicles/${id}`, {
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

  const deleteVehicle = async (id) => {
    setActionLoading(true);
    try {
      await apiFetch(`api/vehicles/${id}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  return { actionLoading, createVehicle, updateVehicle, deleteVehicle };
}
