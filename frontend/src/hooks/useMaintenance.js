import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
let MOCK_MAINTENANCE = [
  { id: "M-101", vehicleId: "V-06", type: "Repair", description: "Engine overheating issues", status: "in-progress", cost: 0, date: "2026-07-10", mechanic: "Ramesh Auto Works" },
  { id: "M-102", vehicleId: "V-12", type: "Scheduled", description: "Routine oil change and brake inspection", status: "pending", cost: 0, date: "2026-07-15", mechanic: "Internal Workshop" },
  { id: "M-103", vehicleId: "V-01", type: "Repair", description: "Replaced faulty alternator", status: "completed", cost: 15400, date: "2026-06-28", mechanic: "Tata Service Center" },
  { id: "M-104", vehicleId: "V-03", type: "Scheduled", description: "Quarterly inspection and tire rotation", status: "completed", cost: 4200, date: "2026-07-01", mechanic: "Internal Workshop" },
  { id: "M-105", vehicleId: "V-08", type: "Repair", description: "AC compressor replacement", status: "completed", cost: 22000, date: "2026-07-06", mechanic: "CoolDrive HVAC" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useMaintenanceLogs(filters = {}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(350);
      let result = [...MOCK_MAINTENANCE];

      if (filters.status && filters.status !== "all") {
        result = result.filter((m) => m.status === filters.status);
      }
      if (filters.vehicleId) {
        result = result.filter((m) => m.vehicleId === filters.vehicleId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (m) =>
            m.id.toLowerCase().includes(q) ||
            m.vehicleId.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.mechanic.toLowerCase().includes(q)
        );
      }
      setLogs(result.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.vehicleId, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

export function useMaintenanceLog(id) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    try {
      await delay(350);
      const found = MOCK_MAINTENANCE.find((m) => m.id === id);
      if (!found) throw new Error("Maintenance log not found");
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

export function useMaintenanceActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createLog = async (data) => {
    setActionLoading(true);
    await delay(600);
    const newLog = {
      id: `M-${(MOCK_MAINTENANCE.length + 101).toString()}`,
      ...data,
      status: data.status || "pending",
      cost: data.cost || 0,
    };
    MOCK_MAINTENANCE = [newLog, ...MOCK_MAINTENANCE];
    setActionLoading(false);
    return { success: true, data: newLog };
  };

  const updateLog = async (id, data) => {
    setActionLoading(true);
    await delay(600);
    const index = MOCK_MAINTENANCE.findIndex((m) => m.id === id);
    if (index === -1) {
      setActionLoading(false);
      return { success: false, message: "Maintenance log not found" };
    }
    MOCK_MAINTENANCE[index] = { ...MOCK_MAINTENANCE[index], ...data };
    setActionLoading(false);
    return { success: true, data: MOCK_MAINTENANCE[index] };
  };

  const deleteLog = async (id) => {
    setActionLoading(true);
    await delay(600);
    MOCK_MAINTENANCE = MOCK_MAINTENANCE.filter((m) => m.id !== id);
    setActionLoading(false);
    return { success: true };
  };

  return { actionLoading, createLog, updateLog, deleteLog };
}
