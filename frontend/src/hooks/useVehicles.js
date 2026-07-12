import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
let MOCK_VEHICLES = [
  { id: "V-01", number: "MH-12-AB-1234", type: "Bus", capacity: 40, status: "in-use", fuelType: "Diesel", model: "Tata Starbus", year: 2023, lastService: "2026-06-28" },
  { id: "V-02", number: "MH-15-GH-3456", type: "Van", capacity: 12, status: "in-use", fuelType: "Diesel", model: "Force Traveller", year: 2024, lastService: "2026-07-05" },
  { id: "V-03", number: "MH-04-CD-5678", type: "Mini Bus", capacity: 26, status: "available", fuelType: "Diesel", model: "Eicher Skyline", year: 2022, lastService: "2026-07-01" },
  { id: "V-04", number: "MH-04-IJ-7890", type: "Bus", capacity: 45, status: "in-use", fuelType: "Diesel", model: "Ashok Leyland Viking", year: 2023, lastService: "2026-06-20" },
  { id: "V-05", number: "MH-12-EF-9012", type: "Bus", capacity: 40, status: "in-use", fuelType: "CNG", model: "Tata Starbus CNG", year: 2024, lastService: "2026-07-08" },
  { id: "V-06", number: "MH-31-KL-2345", type: "Mini Bus", capacity: 20, status: "maintenance", fuelType: "Diesel", model: "Eicher 10.75H", year: 2021, lastService: "2026-07-10" },
  { id: "V-07", number: "MH-20-MN-6789", type: "Bus", capacity: 50, status: "in-use", fuelType: "Diesel", model: "Volvo 9400", year: 2025, lastService: "2026-07-09" },
  { id: "V-08", number: "MH-09-OP-1122", type: "Van", capacity: 10, status: "available", fuelType: "Petrol", model: "Toyota Innova Crysta", year: 2025, lastService: "2026-07-06" },
  { id: "V-09", number: "MH-12-QR-3344", type: "Mini Bus", capacity: 18, status: "in-use", fuelType: "Diesel", model: "Force Urbania", year: 2024, lastService: "2026-07-03" },
  { id: "V-10", number: "MH-14-ST-5566", type: "Bus", capacity: 42, status: "available", fuelType: "Diesel", model: "BharatBenz 1624", year: 2023, lastService: "2026-06-30" },
  { id: "V-11", number: "MH-43-UV-7788", type: "Van", capacity: 8, status: "available", fuelType: "CNG", model: "Maruti Eeco", year: 2024, lastService: "2026-07-07" },
  { id: "V-12", number: "MH-12-WX-9900", type: "Mini Bus", capacity: 22, status: "maintenance", fuelType: "Diesel", model: "Eicher Skyline Pro", year: 2022, lastService: "2026-07-11" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useVehicles(filters = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(350);
      let result = [...MOCK_VEHICLES];

      if (filters.status && filters.status !== "all") {
        result = result.filter((v) => v.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (v) =>
            v.number.toLowerCase().includes(q) ||
            v.type.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q)
        );
      }
      setVehicles(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

export function useVehicle(id) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicle = useCallback(async () => {
    setLoading(true);
    try {
      await delay(350);
      const found = MOCK_VEHICLES.find((v) => v.id === id);
      if (!found) throw new Error("Vehicle not found");
      setVehicle(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchVehicle();
    }
  }, [fetchVehicle, id]);

  return { vehicle, loading, error, refetch: fetchVehicle };
}

export function useVehicleActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createVehicle = async (data) => {
    setActionLoading(true);
    await delay(600);
    const newVehicle = {
      id: `V-${(MOCK_VEHICLES.length + 1).toString().padStart(2, "0")}`,
      ...data,
      status: "available",
    };
    MOCK_VEHICLES = [newVehicle, ...MOCK_VEHICLES];
    setActionLoading(false);
    return { success: true, data: newVehicle };
  };

  const updateVehicle = async (id, data) => {
    setActionLoading(true);
    await delay(600);
    const index = MOCK_VEHICLES.findIndex((v) => v.id === id);
    if (index === -1) {
      setActionLoading(false);
      return { success: false, message: "Vehicle not found" };
    }
    MOCK_VEHICLES[index] = { ...MOCK_VEHICLES[index], ...data };
    setActionLoading(false);
    return { success: true, data: MOCK_VEHICLES[index] };
  };

  const deleteVehicle = async (id) => {
    setActionLoading(true);
    await delay(600);
    MOCK_VEHICLES = MOCK_VEHICLES.filter((v) => v.id !== id);
    setActionLoading(false);
    return { success: true };
  };

  return { actionLoading, createVehicle, updateVehicle, deleteVehicle };
}
