import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem("transitops_user");
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("transitops_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    // For now, we mock the user based on the selected role
    const mockUser = {
      id: "u-" + Math.random().toString(36).substr(2, 9),
      name: role === "Admin" ? "System Admin" : `${role} User`,
      email: `${role.toLowerCase().replace(" ", ".")}@transitops.com`,
      role: role,
    };
    setUser(mockUser);
    localStorage.setItem("transitops_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("transitops_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
