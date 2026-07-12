import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
let MOCK_FUEL_LOGS = [
  { id: "F-101", vehicleId: "V-01", date: "2026-07-10", liters: 150, cost: 13500, station: "HP Petrol Pump", driverId: "D-101" },
  { id: "F-102", vehicleId: "V-04", date: "2026-07-09", liters: 120, cost: 10800, station: "Indian Oil", driverId: "D-102" },
  { id: "F-103", vehicleId: "V-02", date: "2026-07-08", liters: 60, cost: 5400, station: "Reliance Petrol Pump", driverId: "D-105" },
  { id: "F-104", vehicleId: "V-07", date: "2026-07-11", liters: 200, cost: 18000, station: "Bharat Petroleum", driverId: "D-106" },
  { id: "F-105", vehicleId: "V-05", date: "2026-07-12", liters: 80, cost: 6800, station: "HP Petrol Pump", driverId: "D-103" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useFuelLogs(filters = {}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(350);
      let result = [...MOCK_FUEL_LOGS];

      if (filters.vehicleId) {
        result = result.filter((f) => f.vehicleId === filters.vehicleId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (f) =>
            f.station.toLowerCase().includes(q) ||
            f.id.toLowerCase().includes(q) ||
            f.vehicleId.toLowerCase().includes(q)
        );
      }
      setLogs(result.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.vehicleId, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

export function useFuelLog(id) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    try {
      await delay(350);
      const found = MOCK_FUEL_LOGS.find((f) => f.id === id);
      if (!found) throw new Error("Fuel log not found");
      setLog(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchLog();
    }
  }, [fetchLog, id]);

  return { log, loading, error, refetch: fetchLog };
}

export function useFuelActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createLog = async (data) => {
    setActionLoading(true);
    await delay(600);
    const newLog = {
      id: `F-${(MOCK_FUEL_LOGS.length + 101).toString()}`,
      ...data,
      cost: Number(data.cost) || 0,
      liters: Number(data.liters) || 0,
    };
    MOCK_FUEL_LOGS = [newLog, ...MOCK_FUEL_LOGS];
    setActionLoading(false);
    return { success: true, data: newLog };
  };

  const updateLog = async (id, data) => {
    setActionLoading(true);
    await delay(600);
    const index = MOCK_FUEL_LOGS.findIndex((f) => f.id === id);
    if (index === -1) {
      setActionLoading(false);
      return { success: false, message: "Fuel log not found" };
    }
    MOCK_FUEL_LOGS[index] = { 
      ...MOCK_FUEL_LOGS[index], 
      ...data,
      cost: Number(data.cost) || MOCK_FUEL_LOGS[index].cost,
      liters: Number(data.liters) || MOCK_FUEL_LOGS[index].liters,
    };
    setActionLoading(false);
    return { success: true, data: MOCK_FUEL_LOGS[index] };
  };

  const deleteLog = async (id) => {
    setActionLoading(true);
    await delay(600);
    MOCK_FUEL_LOGS = MOCK_FUEL_LOGS.filter((f) => f.id !== id);
    setActionLoading(false);
    return { success: true };
  };

  return { actionLoading, createLog, updateLog, deleteLog };
}
