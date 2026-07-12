const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const driverApi = {
  async getDrivers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    const res = await fetch(`${API_BASE}/drivers?${params}`);
    if (!res.ok) throw new Error("Failed to fetch drivers");
    return res.json();
  },

  async getDriverById(id) {
    const res = await fetch(`${API_BASE}/drivers/${id}`);
    if (!res.ok) throw new Error("Failed to fetch driver");
    return res.json();
  },
};
