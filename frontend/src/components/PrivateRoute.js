/**
 * Private route wrapper component.
 * Restricts access to authenticated users only.
 * Redirects unauthenticated users to the login page.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute component that gates access to its children.
 * While authentication state is loading, renders nothing.
 * Once resolved, either renders the children or redirects to login.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Protected child components.
 * @returns {JSX.Element|null} The children if authenticated, or a redirect.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
