// src/components/NavBar.js

import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file

function NavBar() {
  const { username, logout, role } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext); // Use ThemeContext
  const location = useLocation();

  // Function to determine if the link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${theme}`}>
      {/* Branding Section */}
      <Link to="/" className="navbar-brand">
        Cultural Programme Finder
      </Link>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/venue" className={isActive('/venue') ? 'active' : ''}>
            List of Locations
          </Link>
        </li>
        <li>
          <Link to="/events" className={isActive('/events') ? 'active' : ''}>
            List of Events
          </Link>
        </li>
        <li>
          <Link to="/map" className={isActive('/map') ? 'active' : ''}>
            Map
          </Link>
        </li>
        {username && (
          <li>
            <Link to="/favorites" className={isActive('/favorites') ? 'active' : ''}>
              Favorites
            </Link>
          </li>
        )}
        {role === 'admin' && (
          <li>
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              Admin
            </Link>
          </li>
        )}
        <li>
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
            {theme === 'light' ? 'Light mode' : 'Dark mode'}
          </button>
        </li>
      </ul>

      {/* Authentication Section */}
      <div className="auth-section">
        {username ? (
          <>
            <span>Welcome, {username}</span> |{' '}
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
