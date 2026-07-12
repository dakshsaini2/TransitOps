const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const tripApi = {
  async getTrips(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", filters.page);
    const res = await fetch(`${API_BASE}/trips?${params}`);
    if (!res.ok) throw new Error("Failed to fetch trips");
    return res.json();
  },

  async getTripById(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    if (!res.ok) throw new Error("Failed to fetch trip");
    return res.json();
  },

  async createTrip(data) {
    const res = await fetch(`${API_BASE}/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create trip");
    return res.json();
  },

  async updateTrip(id, data) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update trip");
    return res.json();
  },

  async dispatchTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}/dispatch`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to dispatch trip");
    return res.json();
  },

  async startTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}/start`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to start trip");
    return res.json();
  },

  async completeTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}/complete`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to complete trip");
    return res.json();
  },

  async cancelTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}/cancel`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to cancel trip");
    return res.json();
  },
};
