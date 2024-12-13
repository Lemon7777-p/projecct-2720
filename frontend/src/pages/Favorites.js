// src/components/Favorites.js

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext
import { Link } from 'react-router-dom';
import './Favorites.css'; // Import the CSS file

function Favorites() {
  const { token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Use ThemeContext
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/user/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch favorites.');
      }

      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('An error occurred while fetching your favorite venues.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (venueId) => {
    try {
      const res = await fetch(`http://localhost:4000/user/favorites/${venueId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to remove favorite.');
      }

      setFavorites(favorites.filter((f) => f.venueId !== venueId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('An error occurred while removing the venue from your favorites.');
    }
  };

  return (
    <div className={`favorites-container ${theme}`}>
      {/* Header Section */}
      <div className="favorites-header">
        <h2>Your Favorite Venues</h2>
        <p>Manage your list of favorite venues below.</p>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your favorite venues...</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Favorites Table */}
      {!loading && !error && (
        <>
          {favorites.length > 0 ? (
            <table className="favorites-table">
              <caption className="table-caption">List of Your Favorite Venues</caption>
              <thead>
                <tr>
                  <th scope="col">Venue ID</th>
                  <th scope="col">Venue Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <Link to={`/venue/${f.venueId}`}>{f.venueId}</Link>
                    </td>
                    <td>{f.venuee}</td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() => removeFavorite(f.venueId)}
                        aria-label={`Remove ${f.venuee} from favorites`}
                      >
                        Remove from Favorites
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-favorites-message">
              <p>You have no favorite venues yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Favorites;
