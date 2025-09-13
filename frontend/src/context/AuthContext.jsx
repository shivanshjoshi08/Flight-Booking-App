import React, { createContext, useState, useEffect } from 'react';

// 1. Naya context banayein
export const AuthContext = createContext(null);

// 2. AuthProvider component banayein
// Yeh component saare authentication logic ko manage karega
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Jab app load ho, to localStorage se token check karo
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Login function
  const login = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  // Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // Context ki value jo poori app ko available hogi
  const value = {
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};