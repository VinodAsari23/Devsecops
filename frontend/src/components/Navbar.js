/**
 * Sidebar navigation for the Research Paper Annotation Tool.
 * Fixed left sidebar with links and user controls.
 */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-text">ScholarNotes</div>
        <div className="sidebar-brand-sub">Research Annotation</div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <span className="sidebar-icon">D</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/papers/add" className={isActive('/papers/add')}>
          <span className="sidebar-icon">+</span>
          <span>Add Paper</span>
        </Link>
        <Link to="/search" className={isActive('/search')}>
          <span className="sidebar-icon">S</span>
          <span>Search</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-username">{user?.username}</span>
            <span className="sidebar-role">{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
