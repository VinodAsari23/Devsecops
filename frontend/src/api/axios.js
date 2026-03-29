/**
 * Axios instance configuration for the Research Paper Annotation Tool.
 * Sets up the base URL, JWT authentication interceptor, and 401 redirect handling.
 * The base URL is read from the REACT_APP_API_URL environment variable,
 * falling back to http://localhost:8080 for local development.
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Pre-configured Axios instance with authentication interceptors.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor that attaches the JWT token from localStorage
 * to every outgoing request as a Bearer token in the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor that catches 401 Unauthorized responses,
 * clears stored credentials, and redirects the user to the login page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
