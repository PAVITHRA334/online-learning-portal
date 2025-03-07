import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('student');
  const [userDetails, setUserDetails] = useState(null); 
  const [allUsers, setAllUsers] = useState([]); 

  const login = (role, userDetails) => {
    setLoggedIn(true);
    setRole(role);
    setUserDetails(userDetails);
  };

  const logout = () => {
    setLoggedIn(false);
    setRole('student');
    setUserDetails(null);
    setAllUsers([]);
  };

  const fetchAllUsers = async () => {
    if (role === 'admin') {
      const users = [
        { name: 'John Doe', email: 'john@example.com', role: 'student' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'instructor' }
      ];
      setAllUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, role, userDetails, allUsers, login, logout, fetchAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
