import { useState, useEffect, useCallback } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────
let MOCK_USERS = [
  { id: "U-001", name: "Alice Admin", email: "alice@transitops.com", role: "Admin", status: "Active" },
  { id: "U-002", name: "Bob Dispatcher", email: "bob@transitops.com", role: "Dispatcher", status: "Active" },
  { id: "U-003", name: "Charlie Fleet", email: "charlie@transitops.com", role: "Fleet Manager", status: "Active" },
  { id: "U-004", name: "Diana Safety", email: "diana@transitops.com", role: "Safety Officer", status: "Active" },
  { id: "U-005", name: "Eve Finance", email: "eve@transitops.com", role: "Financial Analyst", status: "Active" },
  { id: "U-006", name: "Frank Dispatch", email: "frank@transitops.com", role: "Dispatcher", status: "Suspended" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(350);
      let result = [...MOCK_USERS];

      if (filters.role && filters.role !== "all") {
        result = result.filter((u) => u.role === filters.role);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.id.toLowerCase().includes(q)
        );
      }
      setUsers(result.sort((a, b) => a.id.localeCompare(b.id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.role, filters.search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      await delay(350);
      const found = MOCK_USERS.find((u) => u.id === id);
      if (!found) throw new Error("User not found");
      setUser(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUser();
    }
  }, [fetchUser, id]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUserActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createUser = async (data) => {
    setActionLoading(true);
    await delay(600);
    const newUser = {
      id: `U-${(MOCK_USERS.length + 100).toString().padStart(3, '0')}`,
      ...data,
    };
    MOCK_USERS = [...MOCK_USERS, newUser];
    setActionLoading(false);
    return { success: true, data: newUser };
  };

  const updateUser = async (id, data) => {
    setActionLoading(true);
    await delay(600);
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index === -1) {
      setActionLoading(false);
      return { success: false, message: "User not found" };
    }
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
    setActionLoading(false);
    return { success: true, data: MOCK_USERS[index] };
  };

  const deleteUser = async (id) => {
    setActionLoading(true);
    await delay(600);
    MOCK_USERS = MOCK_USERS.filter((u) => u.id !== id);
    setActionLoading(false);
    return { success: true };
  };

  return { actionLoading, createUser, updateUser, deleteUser };
}
