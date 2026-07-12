import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
let MOCK_DRIVERS = [
  { id: "D-101", name: "Rajesh Kumar", status: "on-trip", rating: 4.8, phone: "+91 98765 43210", license: "MH12 20100012345" },
  { id: "D-102", name: "Suresh Patil", status: "available", rating: 4.9, phone: "+91 98765 43211", license: "MH14 20110023456" },
  { id: "D-103", name: "Amit Sharma", status: "on-trip", rating: 4.6, phone: "+91 98765 43212", license: "MH09 20120034567" },
  { id: "D-104", name: "Vikram Singh", status: "available", rating: 4.7, phone: "+91 98765 43213", license: "MH12 20150045678" },
  { id: "D-105", name: "Prakash Jadhav", status: "off-duty", rating: 4.5, phone: "+91 98765 43214", license: "MH15 20180056789" },
  { id: "D-106", name: "Sunil Desai", status: "on-trip", rating: 4.9, phone: "+91 98765 43215", license: "MH04 20190067890" },
  { id: "D-107", name: "Mahesh Kadam", status: "available", rating: 4.4, phone: "+91 98765 43216", license: "MH12 20200078901" },
  { id: "D-108", name: "Ramesh Pawar", status: "available", rating: 4.8, phone: "+91 98765 43217", license: "MH14 20210089012" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useDrivers(filters = {}) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(350);
      let result = [...MOCK_DRIVERS];

      if (filters.status && filters.status !== "all") {
        result = result.filter((d) => d.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.license.toLowerCase().includes(q)
        );
      }
      setDrivers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDrivers();
  }, [fetchDrivers]);

  return { drivers, loading, error, refetch: fetchDrivers };
}

export function useDriver(id) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDriver = useCallback(async () => {
    setLoading(true);
    try {
      await delay(350);
      const found = MOCK_DRIVERS.find((d) => d.id === id);
      if (!found) throw new Error("Driver not found");
      setDriver(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDriver();
    }
  }, [fetchDriver, id]);

  return { driver, loading, error, refetch: fetchDriver };
}

export function useDriverActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createDriver = async (data) => {
    setActionLoading(true);
    await delay(600);
    const newDriver = {
      id: `D-${(MOCK_DRIVERS.length + 101).toString()}`,
      rating: 5.0, // Initial rating
      status: "available",
      ...data,
    };
    MOCK_DRIVERS = [newDriver, ...MOCK_DRIVERS];
    setActionLoading(false);
    return { success: true, data: newDriver };
  };

  const updateDriver = async (id, data) => {
    setActionLoading(true);
    await delay(600);
    const index = MOCK_DRIVERS.findIndex((d) => d.id === id);
    if (index === -1) {
      setActionLoading(false);
      return { success: false, message: "Driver not found" };
    }
    MOCK_DRIVERS[index] = { ...MOCK_DRIVERS[index], ...data };
    setActionLoading(false);
    return { success: true, data: MOCK_DRIVERS[index] };
  };

  const deleteDriver = async (id) => {
    setActionLoading(true);
    await delay(600);
    MOCK_DRIVERS = MOCK_DRIVERS.filter((d) => d.id !== id);
    setActionLoading(false);
    return { success: true };
  };

  return { actionLoading, createDriver, updateDriver, deleteDriver };
}
