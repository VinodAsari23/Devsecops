/**
 * Root application component.
 * Configures routing and wraps the application in the AuthProvider context.
 * All private routes require authentication via the PrivateRoute wrapper.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddPaper from './pages/AddPaper';
import PaperDetail from './pages/PaperDetail';
import EditPaper from './pages/EditPaper';
import SearchPapers from './pages/SearchPapers';
import EditAnnotation from './pages/EditAnnotation';
import './App.css';

/**
 * App component serving as the root of the application tree.
 * @returns {JSX.Element} The rendered application with routing configuration.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Navbar />
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/papers/add"
              element={
                <PrivateRoute>
                  <Navbar />
                  <AddPaper />
                </PrivateRoute>
              }
            />
            <Route
              path="/papers/:id"
              element={
                <PrivateRoute>
                  <Navbar />
                  <PaperDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/papers/:id/edit"
              element={
                <PrivateRoute>
                  <Navbar />
                  <EditPaper />
                </PrivateRoute>
              }
            />
            <Route
              path="/papers/:id/annotations/:annId/edit"
              element={
                <PrivateRoute>
                  <Navbar />
                  <EditAnnotation />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Navbar />
                  <SearchPapers />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
