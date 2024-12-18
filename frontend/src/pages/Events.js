// src/components/Events.js

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import './Events.css';

function Events() {
  const { token, loginTime } = useContext(AuthContext);  // Use loginTime from AuthContext
  const { theme } = useContext(ThemeContext);  // Use the theme context
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 100;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:4000/user/events', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch events.');
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('An error occurred while fetching events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Format the login time to HH:MM:SS
  const formatLoginTime = (time) => {
    const year = time.getFullYear().toString().padStart(2, '0');
    const month = (time.getMonth()+1).toString().padStart(2, '0');
    const day = time.getDate().toString().padStart(2, '0');
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  // Calculate the events to display on the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Function to handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`events-container ${theme}`}>
      {/* Header Section */}
      <div className="events-header">
        <h2>Events</h2>
        
        {/* Display login time if available */}
        {loginTime ? (
          <p className="login-time">Last Updated at: {formatLoginTime(loginTime)}</p>
        ) : (
          <p>Loading login time...</p>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Events Table */}
      {!loading && !error && (
        <>
          <table className="events-table">
            <caption className="table-caption">List of Upcoming Events</caption>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
                <th scope="col">Venue</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((e) => (
                  <tr key={e._id}>
                    <td>{e.titlee}</td>
                    <td>{e.cat1}</td>
                    <td>{e.predateE}</td> {/* Displaying date as string */}
                    <td>{e.venueid}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-events-message">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Events;
