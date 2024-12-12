// src/components/NavBar.js
import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

function NavBar() {
  const { username, logout, role } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">List of Locations</Link>
        <Link to="/events">List of Events</Link>
        <Link to="/map">Map</Link>
        {username && <Link to="/favorites">Favorites</Link>}
        {role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div>
        {username ? (
          <>
            Welcome, {username} | <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
