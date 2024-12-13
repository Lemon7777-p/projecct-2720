// src/App.js
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import NavBar from './components/NavBar';
import Venues from './pages/Venues';
import Events from './pages/Events';
import MapPage from './pages/MapPage';
import Favorites from './pages/Favorites';
import VenueDetails from './pages/VenueDetails';
import Login from './pages/Login';
import Admin from './pages/Admin';
import HomePage from './pages/HomePage';

function PrivateRoute({ children, requireAdmin = false }) {
  return (
    <AuthContext.Consumer>
      {({ token, role }) => {
        if (!token) return <Navigate to="/login" />;
        if (requireAdmin && role !== 'admin') return <Navigate to="/" />;
        return children;
      }}
    </AuthContext.Consumer>
  );
}

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <AuthProvider>
      <Router>
        <div className={`app ${theme}`}>
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/venue" element={<PrivateRoute><Venues /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/venue/:id" element={<PrivateRoute><VenueDetails /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute requireAdmin={true}><Admin /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
