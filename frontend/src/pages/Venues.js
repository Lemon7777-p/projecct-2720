import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

function Venues() {
  const { token } = useContext(AuthContext);
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [distance, setDistance] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
    fetchFavorites();
    fetchVenues();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line
  }, [query, category, distance, sortOrder, userLocation]);

  const fetchFavorites = async () => {
    const res = await fetch('http://localhost:4000/user/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFavorites(data.map(f => f.venueId));
  };

  const fetchVenues = async () => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (distance > 0 && userLocation.lat && userLocation.lng) {
      params.append('distance', distance);
      params.append('lat', userLocation.lat);
      params.append('lng', userLocation.lng);
    }

    const res = await fetch(`http://localhost:4000/user/venues?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    // Sort by numEvents
    const sorted = data.sort((a, b) =>
      sortOrder === 'asc' ? a.numEvents - b.numEvents : b.numEvents - a.numEvents
    );
    setVenues(sorted);
  };

  const toggleFavorite = async venueId => {
    if (favorites.includes(venueId)) {
      await fetch(`http://localhost:4000/user/favorites/${venueId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter(f => f !== venueId));
    } else {
      await fetch('http://localhost:4000/user/favorites', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId }),
      });
      setFavorites([...favorites, venueId]);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Venues</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search venues"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Category:
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="inc4">inc4</option>
            <option value="inc4sc5">inc4sc5</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Distance (km):
          <input type="range" min="0" max="50" value={distance} onChange={e => setDistance(e.target.value)} />
          {distance > 0 ? `${distance} km` : 'No distance filter'}
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Sort by number of events:
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '0.5rem',
              backgroundColor: sortOrder === 'asc' ? '#4CAF50' : '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </label>
      </div>

      <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Venue ID</th>
            <th>Venue Name</th>
            <th>Number of Events</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {venues.map(v => (
            <tr key={v._id}>
              <td>
                <Link to={`/venue/${v.venueId}`}>{v.venueId}</Link>
              </td>
              <td>{v.venuee}</td>
              <td>{v.numEvents || 0}</td>
              <td>
                <button onClick={() => toggleFavorite(v.venueId)}>
                  {favorites.includes(v.venueId) ? 'Remove Favorite' : 'Add to Favorite'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Venues;
