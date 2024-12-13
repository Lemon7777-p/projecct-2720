// src/pages/MapPage.js
import React, { useEffect, useRef, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext

import 'mapbox-gl/dist/mapbox-gl.css';

function MapPage() {
  const { token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Access the current theme
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [venues, setVenues] = useState([]);
  const markersRef = useRef([]); // To store marker references

  // Fetch venues from backend
  useEffect(() => {
    fetch('http://localhost:4000/user/venues', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setVenues(data))
      .catch((err) => console.error('Error fetching venues:', err));
  }, [token]);

  // Initialize the Mapbox map
  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    mapboxgl.accessToken =
      'pk.eyJ1IjoicHJlc3RvbmR1dSIsImEiOiJjbTRqY25zcjkwYzB0MnFva29uaDRqczF0In0.NiyQjDTignWnXSckDVSS_g';

    // Determine the initial style based on the current theme
    const initialStyle =
      theme === 'dark'
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/streets-v11';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [114.17, 22.3], // Default center [lng, lat]
      zoom: 11, // Default zoom
    });

    // Add navigation controls to the map (only once)
    const nav = new mapboxgl.NavigationControl();
    mapRef.current.addControl(nav);

    // When the map is loaded, add markers
    mapRef.current.on('load', () => {
      addMarkers();
    });

    return () => mapRef.current?.remove(); // Cleanup map on component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once

  // Function to add markers
  const addMarkers = () => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    venues.forEach((venue) => {
      if (venue.latitude && venue.longitude) {
        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([parseFloat(venue.longitude), parseFloat(venue.latitude)])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3 style="color: #000000;">${venue.venuee}</h3>
               <p style="color: #000000;">${venue.latitude}, ${venue.longitude}</p>
               <a href="/venue/${venue.venueId}">View Details</a>`
            )
          )
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      }
    });
  };

  // Update markers when venues change
  useEffect(() => {
    if (!mapRef.current) return;

    // Check if the map is loaded
    if (mapRef.current.isStyleLoaded()) {
      addMarkers();
    } else {
      // If not loaded yet, wait for the load event
      mapRef.current.on('load', addMarkers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues]);

  // Update map style when the theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    const handleStyleChange = () => {
      const newStyle =
        theme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/streets-v11';

      // Only update the style if it's different
      if (mapRef.current.getStyle().sprite !== newStyle) {
        mapRef.current.setStyle(newStyle);

        // Re-add markers after style change
        mapRef.current.on('style.load', () => {
          addMarkers();
        });
      }
    };

    // Check if the map is loaded before attempting to change the style
    if (mapRef.current.isStyleLoaded()) {
      handleStyleChange();
    } else {
      mapRef.current.on('load', handleStyleChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

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
