/**
 * Signup page component for the Research Paper Annotation Tool.
 * Allows new users to create an account with username, email, and password.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Signup.css';

/**
 * Signup component providing user registration functionality.
 * On successful registration, redirects to the login page.
 * @returns {JSX.Element} The rendered signup page.
 */
const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle form submission for account creation.
   * Validates password match before making the API call.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/signup', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-brand">ScholarNotes</h1>
          <p className="signup-subtitle">Create Your Account</p>
        </div>

        <div className="signup-body">
          {error && <div className="signup-error">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-field">
              <label htmlFor="username" className="signup-label">Username</label>
              <input
                id="username"
                type="text"
                className="signup-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="email" className="signup-label">Email</label>
              <input
                id="email"
                type="email"
                className="signup-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="password" className="signup-label">Password</label>
              <input
                id="password"
                type="password"
                className="signup-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="signup-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="signup-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="signup-login-link">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
