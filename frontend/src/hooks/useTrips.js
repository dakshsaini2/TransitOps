import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import "../types";

/**
 * @param {Object} filters
 * @param {string} [filters.status]
 * @param {string} [filters.search]
 * @returns {{trips: import('../types').Trip[], loading: boolean, error: string|null, refetch: function}}
 */
export function useTrips(filters = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status.toUpperCase());
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `api/trips${queryString ? `?${queryString}` : ""}`;
      
      const result = await apiFetch(endpoint);
      setTrips(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
}

/**
 * @param {number|string} id
 * @returns {{trip: import('../types').Trip|null, loading: boolean, error: string|null, refetch: function}}
 */
export function useTrip(id) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(`api/trips/${id}`);
      setTrip(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return { trip, loading, error, refetch: fetchTrip };
}

export function useTripActions() {
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
    createTrip: (data) => performAction("api/trips", "POST", data),
    updateTrip: (id, data) => performAction(`api/trips/${id}`, "PUT", data),
    dispatchTrip: (id) => performAction(`api/trips/${id}/dispatch`, "POST"),
    startTrip: (id) => performAction(`api/trips/${id}/start`, "POST"),
    completeTrip: (id) => performAction(`api/trips/${id}/complete`, "POST"),
    cancelTrip: (id) => performAction(`api/trips/${id}/cancel`, "POST"),
  };
}

