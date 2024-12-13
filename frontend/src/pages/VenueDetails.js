// src/components/VenueDetails.js

import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './VenueDetails.css'; // Import the CSS file

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 'N/A';

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2) + ' km';
};

function VenueDetails() {
  const { token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Use ThemeContext
  const { id } = useParams();
  const [venueData, setVenueData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Set your Mapbox access token here
  mapboxgl.accessToken =
    'pk.eyJ1IjoicHJlc3RvbmR1dSIsImEiOiJjbTRqY25zcjkwYzB0MnFva29uaDRqczF0In0.NiyQjDTignWnXSckDVSS_g'; // Replace with your actual token

  // Effect to get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Error fetching user location:', err);
          setError('Unable to retrieve your location. Distance will be unavailable.');
          // Proceed without user location
          setUserLocation({ lat: null, lng: null });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  // Effect to fetch venue details once user location is available
  useEffect(() => {
    fetchVenueDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  // Function to fetch venue details from the backend
  const fetchVenueDetails = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userLocation.lat && userLocation.lng) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
      }

      const res = await fetch(`http://localhost:4000/user/venues/${id}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setVenueData(data);
        setComments(data.comments || []);
      } else {
        console.error('Failed to fetch venue details');
        setError('Failed to fetch venue details. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching venue details:', error);
      setError('An error occurred while fetching venue details.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to initialize and update the map
  useEffect(() => {
    if (!venueData) return;

    const { latitude, longitude, venuee, venueId } = venueData.venue;
    const hasCoordinates = latitude && longitude;
    const center = hasCoordinates
      ? [parseFloat(longitude), parseFloat(latitude)]
      : [114.1694, 22.3193]; // Default to Hong Kong
    const zoom = hasCoordinates ? 14 : 11;

    // Initialize the map if it hasn't been initialized yet
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom,
      });

      // Add navigation controls (zoom in/out)
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      // Add a marker if venue has coordinates
      if (hasCoordinates) {
        markerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(center)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>${venuee}</h3><p>Venue ID: ${venueId}</p>`
            )
          )
          .addTo(mapRef.current);
      }
    } else {
      // Update the map center
      mapRef.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true, // This animation is considered essential with respect to prefers-reduced-motion
      });

      // Remove existing marker if any
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Add a new marker if venue has coordinates
      if (hasCoordinates) {
        markerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(center)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>${venuee}</h3><p>Venue ID: ${venueId}</p>`
            )
          )
          .addTo(mapRef.current);
      }
    }

    // Cleanup on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [venueData]);

  // Function to add a new comment
  const addComment = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/user/venues/${id}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments([addedComment, ...comments]);
        setNewComment('');
      } else {
        alert('Failed to add comment!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('An error occurred while adding your comment.');
    }
  };

  // If data is still loading
  if (loading) return <div className="loading">Loading...</div>;

  // If there's an error
  if (error) return <div className="error-message">{error}</div>;

  if (!venueData) return null;

  const { venue, events } = venueData;

  // Calculate distance using the Haversine formula
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    venue.latitude,
    venue.longitude
  );

  return (
    <div className={`venue-details-container ${theme}`}>
      {/* Header Section */}
      <div className="venue-header">
        <h2>{venue.venuee}</h2>
        <p>Venue ID: {venue.venueId}</p>
        <p>Distance to You: {distance}</p>
      </div>

      {/* Map Section */}
      <div ref={mapContainerRef} className="map-section" />

      {/* Venue Information */}
      <div className="venue-info">
        <div>
          <h3>Location</h3>
          <p>Latitude: {venue.latitude || 'N/A'}</p>
          <p>Longitude: {venue.longitude || 'N/A'}</p>
        </div>
        <div>
          <h3>Number of Events</h3>
          <p>{events.length}</p>
        </div>
        {/* Add more venue information as needed */}
      </div>

      <div className="EventComentContainer">
        {/* Events List */}
        <div className="events-section">
          <h3>Events at this Venue:</h3>
          {events.length > 0 ? (
            <ul className="events-list">
              {events.map((e) => (
                <li key={e._id}>{e.titlee}</li>
              ))}
            </ul>
          ) : (
            <p>No events scheduled at this venue.</p>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments:</h3>
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            <ul className="comments-list">
              {comments.map((comment) => (
                <li key={comment._id}>
                  <strong>{comment.user}</strong>: {comment.text}
                </li>
              ))}
            </ul>
          )}

          {/* Add Comment Form */}
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment here..."
              rows="3"
            />
            <button onClick={addComment}>Submit Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDetails;
