/**
 * Navigation bar component for the Research Paper Annotation Tool.
 * Displays the ScholarNotes brand, navigation links, and user controls.
 * Only rendered for authenticated users within private routes.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar component providing primary navigation across the application.
 * Shows links to Dashboard, Add Paper, and Search pages.
 * Displays the current user's name and a logout button.
 * @returns {JSX.Element} The rendered navigation bar.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle user logout and redirect to the login page.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          ScholarNotes
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/papers/add" className="navbar-link">Add Paper</Link>
          <Link to="/search" className="navbar-link">Search</Link>
        </div>
        <div className="navbar-user">
          <span className="navbar-welcome">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="navbar-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
