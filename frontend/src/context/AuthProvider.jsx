import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

// Initialize user directly from localStorage → NO need for setState in effect
const getInitialUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getInitialUser());
  const loading = user === undefined;

  // Update axios headers whenever user changes
  useEffect(() => {
    if (user?.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const userData = response.data;

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });

    const userData = response.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
