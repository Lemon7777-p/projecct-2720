// src/pages/Admin.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Admin() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [newEvent, setNewEvent] = useState({ titlee: '', venueid: '', predateE: '', cat1: '' });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [editEvent, setEditEvent] = useState(null); // Event to edit
  const [editUser, setEditUser] = useState(null); // User to edit

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, [token]);

  const fetchEvents = async () => {
    const res = await fetch('http://localhost:4000/admin/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:4000/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const handleEventCreate = async () => {
    const res = await fetch('http://localhost:4000/admin/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });
    if (res.ok) {
      fetchEvents();
      setNewEvent({ titlee: '', venueid: '', predateE: '', cat1: '' });
    }
  };

  const handleUserCreate = async () => {
    const res = await fetch('http://localhost:4000/admin/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      fetchUsers();
      setNewUser({ username: '', password: '', role: 'user' });
    }
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    await fetch(`http://localhost:4000/admin/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEvents();
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`http://localhost:4000/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleEventUpdate = async () => {
    const res = await fetch(`http://localhost:4000/admin/events/${editEvent._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editEvent),
    });
    if (res.ok) {
      fetchEvents();
      setEditEvent(null);
    }
  };

  const handleUserUpdate = async () => {
    const payload = {
      username: editUser.username,
      role: editUser.role,
    };

    if (editUser.password) {
      payload.password = editUser.password;
    }

    const res = await fetch(`http://localhost:4000/admin/users/${editUser._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      fetchUsers();
      setEditUser(null);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Panel</h2>

      {/* Manage Events Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h3>Manage Events</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Venue ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.titlee}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.venueid}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.predateE}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.cat1}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => setEditEvent(event)}
                    style={{ marginRight: '5px', padding: '5px 10px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleEventDelete(event._id)}
                    style={{ padding: '5px 10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editEvent ? (
          <div>
            <h4>Edit Event</h4>
            <input
              placeholder="Title"
              value={editEvent.titlee}
              onChange={(e) => setEditEvent({ ...editEvent, titlee: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <input
              placeholder="Venue ID"
              value={editEvent.venueid}
              onChange={(e) => setEditEvent({ ...editEvent, venueid: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <input
              placeholder="Date"
              value={editEvent.predateE}
              onChange={(e) => setEditEvent({ ...editEvent, predateE: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <select
              value={editEvent.cat11}
              onChange={(e) => setEditEvent({ ...editEvent, cat1: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            >
              <option value="">Select Category</option>
              <option value="inc4">inc4</option>
              <option value="inc6">inc6</option>
              <option value="inc7">inc7</option>
            </select>
            <button onClick={handleEventUpdate} style={{ marginRight: '10px' }}>
              Update
            </button>
            <button onClick={() => setEditEvent(null)}>Cancel</button>
          </div>
        ) : (
          <div>
            <h4>Create Event</h4>
            <input
              placeholder="Title"
              value={newEvent.titlee}
              onChange={(e) => setNewEvent({ ...newEvent, titlee: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <input
              placeholder="Venue ID"
              value={newEvent.venueid}
              onChange={(e) => setNewEvent({ ...newEvent, venueid: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <input
              placeholder="Date"
              value={newEvent.predateE}
              onChange={(e) => setNewEvent({ ...newEvent, predateE: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <select
              value={newEvent.cat1}
              onChange={(e) => setNewEvent({ ...newEvent, cat1: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            >
              <option value="">Select Category</option>
              <option value="inc4">inc4</option>
              <option value="inc6">inc6</option>
              <option value="inc7">inc7</option>
            </select>
            <button onClick={handleEventCreate}>Create</button>
          </div>
        )}
      </div>

      {/* Manage Users Section */}
      <div>
        <h3>Manage Users</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => setEditUser(user)}
                    style={{ marginRight: '5px', padding: '5px 10px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUserDelete(user._id)}
                    style={{ padding: '5px 10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editUser ? (
          <div>
            <h4>Edit User</h4>
            <input
              placeholder="Username"
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <input
              placeholder="Password"
              type="password"
              value={editUser.password || ''}
              onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleUserUpdate} style={{ marginRight: '10px' }}>
              Update
            </button>
            <button onClick={() => setEditUser(null)}>Cancel</button>
          </div>
        ) : (
          <div>
            <h4>Create User</h4>
            <input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleUserCreate}>Create</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;