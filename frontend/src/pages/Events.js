import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';

function Events() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/user/events', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setEvents(data));
  }, [token]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Events</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.titlee}</td>
              <td>{e.predateE}</td>
              <td>{e.venueid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Events;
