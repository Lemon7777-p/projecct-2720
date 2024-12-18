// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [loginTime, setLoginTime] = useState(null);  // Store login time here

  useEffect(() => {
    if (token) {
      fetch('http://localhost:4000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
          setRole(data.role || 'user');
          setLoginTime(new Date());  // Set the login time when token is available
        })
        .catch(() => {
          setToken(null);
          setUsername(null);
          setRole(null);
          setLoginTime(null);  // Reset login time if token is invalid
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setLoginTime(new Date());  // Set login time when user logs in
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername(null);
    setRole(null);
    setLoginTime(null);  // Clear login time on logout
  };

  return (
    <AuthContext.Provider value={{ token, username, role, loginTime, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
