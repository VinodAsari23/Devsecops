/**
 * Login page component for the Research Paper Annotation Tool.
 * Features a centered card design with a purple gradient header,
 * credential input fields, and a one-click examiner login option.
 * Unique layout distinct from other project login pages.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

/**
 * Login component providing user authentication.
 * Includes a quick-access examiner login button for demonstration.
 * @returns {JSX.Element} The rendered login page.
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle form submission for standard login.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle one-click examiner login with preset credentials.
   */
  const handleExaminerLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('examiner', 'Research@Tool2024');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Examiner login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-header-decoration"></div>
          <h1 className="login-brand"> Welcome to ScholarNotes</h1>
          <p className="login-subtitle">Research Paper Annotation Tool</p>
          
        </div>

        <div className="login-body">
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="username" className="login-label">Username</label>
              <input
                id="username"
                type="text"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                id="password"
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="login-examiner-box">
            <h3 className="login-examiner-title">Examiner Access</h3>
            <div className="login-examiner-credentials">
              <div className="login-credential-row">
                <span className="login-credential-label">Username:</span>
                <code className="login-credential-value">examiner</code>
              </div>
              <div className="login-credential-row">
                <span className="login-credential-label">Password:</span>
                <code className="login-credential-value">Research@Tool2024</code>
              </div>
            </div>
            <button
              onClick={handleExaminerLogin}
              className="login-examiner-btn"
              disabled={loading}
            >
              Login as Examiner
            </button>
          </div>

          <p className="login-footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="login-signup-link">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
