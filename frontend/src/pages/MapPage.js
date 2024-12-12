// src/pages/MapPage.js
import React, { useEffect, useRef, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { AuthContext } from '../AuthContext';

import 'mapbox-gl/dist/mapbox-gl.css';

function MapPage() {
  const { token } = useContext(AuthContext);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    // Fetch venues from backend
    fetch('http://localhost:4000/user/venues', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVenues(data))
      .catch((err) => console.error('Error fetching venues:', err));
  }, [token]);

  useEffect(() => {
    // Initialize the Mapbox map
    mapboxgl.accessToken =
      'pk.eyJ1IjoicHJlc3RvbmR1dSIsImEiOiJjbTRqY25zcjkwYzB0MnFva29uaDRqczF0In0.NiyQjDTignWnXSckDVSS_g';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [114.17, 22.3], // Default center [lng, lat]
      zoom: 11, // Default zoom
    });

    // Add markers for venues
    venues.forEach((venue) => {
      if (venue.latitude && venue.longitude) {
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([parseFloat(venue.longitude), parseFloat(venue.latitude)])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>${venue.venuee}</h3><p>${venue.latitude}, ${venue.longitude}</p><a href="/venue/${venue.venueId}" style="color: blue; text-decoration: underline;">View Details</a>`
            )
          ) // Add popup to show venue details
          .addTo(mapRef.current);
      }
    });

    return () => mapRef.current?.remove(); // Cleanup map on component unmount
  }, [venues]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100vh', // Full screen height
      }}
    />
  );
}

export default MapPage;