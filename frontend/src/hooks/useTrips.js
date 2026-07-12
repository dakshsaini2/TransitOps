import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_TRIPS = [
  {
    id: "TRP-001",
    origin: "Pune",
    destination: "Mumbai",
    vehicle: { id: "V-01", number: "MH-12-AB-1234", type: "Bus" },
    driver: { id: "D-01", name: "Rajesh Sharma", phone: "+91 98765 43210" },
    status: "in-progress",
    scheduledDate: "2026-07-12",
    scheduledTime: "06:30",
    dispatchedAt: "2026-07-12T06:35:00",
    startedAt: "2026-07-12T06:40:00",
    completedAt: null,
    notes: "Express route via Expressway",
    createdAt: "2026-07-11T20:00:00",
  },
  {
    id: "TRP-002",
    origin: "Mumbai",
    destination: "Nashik",
    vehicle: { id: "V-03", number: "MH-04-CD-5678", type: "Mini Bus" },
    driver: { id: "D-03", name: "Suresh Kulkarni", phone: "+91 91234 56780" },
    status: "scheduled",
    scheduledDate: "2026-07-12",
    scheduledTime: "09:00",
    dispatchedAt: null,
    startedAt: null,
    completedAt: null,
    notes: "15 passengers confirmed",
    createdAt: "2026-07-11T22:00:00",
  },
  {
    id: "TRP-003",
    origin: "Pune",
    destination: "Kolhapur",
    vehicle: { id: "V-05", number: "MH-12-EF-9012", type: "Bus" },
    driver: { id: "D-05", name: "Vikram Jadhav", phone: "+91 87654 32100" },
    status: "dispatched",
    scheduledDate: "2026-07-12",
    scheduledTime: "08:00",
    dispatchedAt: "2026-07-12T07:50:00",
    startedAt: null,
    completedAt: null,
    notes: "",
    createdAt: "2026-07-11T21:30:00",
  },
  {
    id: "TRP-004",
    origin: "Nashik",
    destination: "Aurangabad",
    vehicle: { id: "V-02", number: "MH-15-GH-3456", type: "Van" },
    driver: { id: "D-02", name: "Amit Patel", phone: "+91 99887 76655" },
    status: "completed",
    scheduledDate: "2026-07-12",
    scheduledTime: "05:00",
    dispatchedAt: "2026-07-12T04:55:00",
    startedAt: "2026-07-12T05:02:00",
    completedAt: "2026-07-12T08:45:00",
    notes: "Delivered on time",
    createdAt: "2026-07-11T18:00:00",
  },
  {
    id: "TRP-005",
    origin: "Mumbai",
    destination: "Surat",
    vehicle: { id: "V-04", number: "MH-04-IJ-7890", type: "Bus" },
    driver: { id: "D-04", name: "Pradeep Singh", phone: "+91 88776 65544" },
    status: "completed",
    scheduledDate: "2026-07-12",
    scheduledTime: "04:30",
    dispatchedAt: "2026-07-12T04:25:00",
    startedAt: "2026-07-12T04:32:00",
    completedAt: "2026-07-12T09:10:00",
    notes: "Interstate trip — Gujarat border",
    createdAt: "2026-07-11T17:00:00",
  },
  {
    id: "TRP-006",
    origin: "Pune",
    destination: "Solapur",
    vehicle: null,
    driver: null,
    status: "scheduled",
    scheduledDate: "2026-07-12",
    scheduledTime: "11:00",
    dispatchedAt: null,
    startedAt: null,
    completedAt: null,
    notes: "Awaiting vehicle and driver assignment",
    createdAt: "2026-07-12T07:00:00",
  },
  {
    id: "TRP-007",
    origin: "Nagpur",
    destination: "Amravati",
    vehicle: { id: "V-06", number: "MH-31-KL-2345", type: "Mini Bus" },
    driver: { id: "D-06", name: "Manoj Deshmukh", phone: "+91 77665 54433" },
    status: "cancelled",
    scheduledDate: "2026-07-12",
    scheduledTime: "07:00",
    dispatchedAt: null,
    startedAt: null,
    completedAt: null,
    notes: "Cancelled due to vehicle breakdown",
    createdAt: "2026-07-11T19:00:00",
  },
  {
    id: "TRP-008",
    origin: "Aurangabad",
    destination: "Pune",
    vehicle: { id: "V-07", number: "MH-20-MN-6789", type: "Bus" },
    driver: { id: "D-07", name: "Sachin Pawar", phone: "+91 66554 43322" },
    status: "in-progress",
    scheduledDate: "2026-07-12",
    scheduledTime: "07:30",
    dispatchedAt: "2026-07-12T07:25:00",
    startedAt: "2026-07-12T07:33:00",
    completedAt: null,
    notes: "Return trip — 22 passengers",
    createdAt: "2026-07-11T23:00:00",
  },
  {
    id: "TRP-009",
    origin: "Kolhapur",
    destination: "Goa",
    vehicle: { id: "V-08", number: "MH-09-OP-1122", type: "Van" },
    driver: { id: "D-08", name: "Dinesh Naik", phone: "+91 55443 32211" },
    status: "scheduled",
    scheduledDate: "2026-07-12",
    scheduledTime: "13:00",
    dispatchedAt: null,
    startedAt: null,
    completedAt: null,
    notes: "Tourist group — 8 passengers",
    createdAt: "2026-07-12T06:00:00",
  },
  {
    id: "TRP-010",
    origin: "Pune",
    destination: "Shirdi",
    vehicle: { id: "V-09", number: "MH-12-QR-3344", type: "Mini Bus" },
    driver: { id: "D-09", name: "Ganesh Bhosale", phone: "+91 44332 21100" },
    status: "dispatched",
    scheduledDate: "2026-07-12",
    scheduledTime: "10:00",
    dispatchedAt: "2026-07-12T09:50:00",
    startedAt: null,
    completedAt: null,
    notes: "Pilgrimage group",
    createdAt: "2026-07-12T05:00:00",
  },
];

// Simulate API delay
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── useTrips hook ──────────────────────────────────────────────────────────
export function useTrips(filters = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(400);
      let result = [...MOCK_TRIPS];

      if (filters.status && filters.status !== "all") {
        result = result.filter((t) => t.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.id.toLowerCase().includes(q) ||
            t.origin.toLowerCase().includes(q) ||
            t.destination.toLowerCase().includes(q) ||
            (t.driver && t.driver.name.toLowerCase().includes(q)) ||
            (t.vehicle && t.vehicle.number.toLowerCase().includes(q))
        );
      }
      setTrips(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
}

// ── useTrip hook (single trip) ─────────────────────────────────────────────
export function useTrip(id) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      await delay(300);
      const found = MOCK_TRIPS.find((t) => t.id === id);
      if (!found) throw new Error("Trip not found");
      setTrip({ ...found });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrip();
  }, [fetchTrip]);

  return { trip, loading, error, refetch: fetchTrip };
}

// ── useTripActions hook ────────────────────────────────────────────────────
export function useTripActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const performAction = async (actionName) => {
    setActionLoading(true);
    try {
      await delay(600);
      // In production, this would call the API
      return { success: true, message: `${actionName} successful` };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    createTrip: () => performAction("Create trip"),
    updateTrip: () => performAction("Update trip"),
    dispatchTrip: () => performAction("Dispatch trip"),
    startTrip: () => performAction("Start trip"),
    completeTrip: () => performAction("Complete trip"),
    cancelTrip: () => performAction("Cancel trip"),
  };
}
