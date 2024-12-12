// src/pages/Venues.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import './Venues.css'; // Import the CSS file

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
    try {
      const res = await fetch('http://localhost:4000/user/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch favorites.');
      }
      const data = await res.json();
      setFavorites(data.map(f => f.venueId));
    } catch (error) {
      console.error(error);
      // Optionally, set an error state here to inform the user
    }
  };

  const fetchVenues = async () => {
    try {
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

      if (!res.ok) {
        throw new Error('Failed to fetch venues.');
      }

      const data = await res.json();

      // Sort by numEvents
      const sorted = data.sort((a, b) =>
        sortOrder === 'asc' ? a.numEvents - b.numEvents : b.numEvents - a.numEvents
      );
      setVenues(sorted);
    } catch (error) {
      console.error(error);
      // Optionally, set an error state here to inform the user
    }
  };

  const toggleFavorite = async venueId => {
    try {
      if (favorites.includes(venueId)) {
        const res = await fetch(`http://localhost:4000/user/favorites/${venueId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to remove favorite.');
        }
        setFavorites(favorites.filter(f => f !== venueId));
      } else {
        const res = await fetch('http://localhost:4000/user/favorites', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ venueId }),
        });
        if (!res.ok) {
          throw new Error('Failed to add favorite.');
        }
        setFavorites([...favorites, venueId]);
      }
    } catch (error) {
      console.error(error);
      // Optionally, set an error state here to inform the user
    }
  };

  return (
    <div className="venues-container">
      <h2 className="venues-header">Venues</h2>

      <div className="venues-filters">
        {/* Search Bar */}
        <div className="filter-group">
          <label htmlFor="search">Search Venues</label>
          <input
            type="text"
            id="search"
            placeholder="Search venues..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="inc4">inc4</option>
            <option value="inc4sc5">inc4sc5</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="filter-group">
          <label htmlFor="distance">Distance (km): {distance > 0 ? `${distance} km` : 'No filter'}</label>
          <input
            type="range"
            id="distance"
            min="0"
            max="50"
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
          />
        </div>

        {/* Sort Button */}
        <div className="filter-group">
          <label htmlFor="sort">Sort by Number of Events</label>
          <button
            id="sort"
            className="sort-button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Venues Table */}
      <table className="venues-table">
        <thead>
          <tr>
            <th>Venue ID</th>
            <th>Venue Name</th>
            <th>Number of Events</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {venues.length > 0 ? (
            venues.map(v => (
              <tr key={v._id}>
                <td>
                  <Link to={`/venue/${v.venueId}`}>{v.venueId}</Link>
                </td>
                <td>{v.venuee}</td>
                <td>{v.numEvents || 0}</td>
                <td>
                  <button
                    className="favorite-button"
                    onClick={() => toggleFavorite(v.venueId)}
                  >
                    {favorites.includes(v.venueId) ? 'Remove Favorite' : 'Add to Favorite'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                No venues found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Venues;
