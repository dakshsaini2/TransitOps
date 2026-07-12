const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const vehicleApi = {
  async getVehicles(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    const res = await fetch(`${API_BASE}/vehicles?${params}`);
    if (!res.ok) throw new Error("Failed to fetch vehicles");
    return res.json();
  },

  async getVehicleById(id) {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    if (!res.ok) throw new Error("Failed to fetch vehicle");
    return res.json();
  },
};
