import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in (from LocalStorage) on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data:", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // 2. Login Function (Connects to Backend)
  const login = async (email, password) => {
    try {
      // NOTE: Ensure vite.config.js proxy routes /api to localhost:5000
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 3. Create the user object based on backend response
      // 'data.user' comes from the backend code you provided
      const userData = {
        ...data.user, // Contains _id, name, email, institution, etc.
        role: data.role || "Student (Guest)", // Use role from backend response
      };

      // 4. Update State and LocalStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Store ID separately if needed for easy access in other components
      if (userData._id) {
        localStorage.setItem("userId", userData._id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
