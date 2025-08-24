import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <Link to="/leads" style={{ color: 'white', textDecoration: 'none' }}>
          <h1>Lead Management System</h1>
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Welcome, {user.email}</span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
