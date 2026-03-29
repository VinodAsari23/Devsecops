/**
 * Root application component with sidebar layout.
 * Public routes (login/signup) render without sidebar.
 * Private routes render with a fixed sidebar and main content area.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Navbar';
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
 * Layout wrapper that renders the sidebar alongside the page content.
 */
const AppLayout = ({ children }) => (
  <>
    <Sidebar />
    <div className="main-content">
      {children}
    </div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>
            } />
            <Route path="/papers/add" element={
              <PrivateRoute><AppLayout><AddPaper /></AppLayout></PrivateRoute>
            } />
            <Route path="/papers/:id" element={
              <PrivateRoute><AppLayout><PaperDetail /></AppLayout></PrivateRoute>
            } />
            <Route path="/papers/:id/edit" element={
              <PrivateRoute><AppLayout><EditPaper /></AppLayout></PrivateRoute>
            } />
            <Route path="/papers/:id/annotations/:annId/edit" element={
              <PrivateRoute><AppLayout><EditAnnotation /></AppLayout></PrivateRoute>
            } />
            <Route path="/search" element={
              <PrivateRoute><AppLayout><SearchPapers /></AppLayout></PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
