import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

function Favorites() {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  const fetchFavorites = async () => {
    const res = await fetch('http://localhost:4000/user/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFavorites(data);
  };

  const removeFavorite = async venueId => {
    await fetch(`http://localhost:4000/user/favorites/${venueId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(favorites.filter(f => f.venueId !== venueId));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Your Favorite Venues</h2>
      <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Venue ID</th>
            <th>Venue Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map(f => (
            <tr key={f._id}>
              <td>
                <Link to={`/venue/${f.venueId}`}>{f.venueId}</Link>
              </td>
              <td>{f.venuee}</td>
              <td>
                <button onClick={() => removeFavorite(f.venueId)}>Remove from Favorites</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Favorites;
