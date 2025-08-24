import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import LeadsList from './pages/LeadsList';
import LeadForm from './pages/LeadForm';

// Main app component that uses auth context
function AppContent() {
  const { loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#2c3e50'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading Lead Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/leads" element={
            <PrivateRoute>
              <LeadsList />
            </PrivateRoute>
          } />
          <Route path="/leads/new" element={
            <PrivateRoute>
              <LeadForm />
            </PrivateRoute>
          } />
          <Route path="/leads/:id/edit" element={
            <PrivateRoute>
              <LeadForm />
            </PrivateRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="*" element={<Navigate to="/leads" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
