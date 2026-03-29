/**
 * Authentication context for the Research Paper Annotation Tool.
 * Provides login, logout, and authentication state management.
 * Stores the JWT token and user information in localStorage for persistence.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application and provides
 * authentication state and actions to all child components.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {JSX.Element} The AuthContext provider wrapping children.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * On mount, restore authentication state from localStorage.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Authenticate the user with the backend API.
   * Stores the returned token and user data in both state and localStorage.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} The authenticated user data.
   */
  const login = async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
    setToken(data.token);
    setUser({ username: data.username, role: data.role });
    return data;
  };

  /**
   * Log the user out by clearing all stored authentication state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  /**
   * Check whether the user is currently authenticated.
   * @returns {boolean} True if a valid token exists.
   */
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the authentication context.
 * @returns {Object} The authentication context value.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
