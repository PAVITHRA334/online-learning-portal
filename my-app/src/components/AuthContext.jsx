import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token && storedRole) {
      setLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const login = (userRole, userDetails) => {
    localStorage.setItem("role", userRole);
    localStorage.setItem("token", userDetails.token);
    localStorage.setItem("username", userDetails.username);
    setLoggedIn(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
