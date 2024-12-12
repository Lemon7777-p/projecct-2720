import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function VenueDetails() {
  const { token, username } = useContext(AuthContext);
  const { id } = useParams();
  const [venueData, setVenueData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
    fetchVenueDetails();
  }, [id, token]);

  const fetchVenueDetails = async () => {
    const res = await fetch(`http://localhost:4000/user/venues/${id}?lat=${userLocation.lat || ''}&lng=${userLocation.lng || ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setVenueData(data);
    setComments(data.comments || []);
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

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
  };

  if (!venueData) return <div>Loading...</div>;

  const { venue, events, distance } = venueData;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{venue.venuee}</h2>
      <p>Venue ID: {venue.venueId}</p>
      <p>Distance to You: {distance}</p>

      <h3>Events at this Venue:</h3>
      <ul>
        {events.map(e => (
          <li key={e._id}>{e.titlee}</li>
        ))}
      </ul>

      <h3>Comments:</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul>
          {comments.map(comment => (
            <li key={comment._id}>
              <strong>{comment.user}</strong>: {comment.text}
            </li>
          ))}
        </ul>
      )}

      <textarea
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Add your comment here..."
        rows="3"
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <button onClick={addComment} style={{ marginTop: '0.5rem' }}>
        Submit Comment
      </button>
    </div>
  );
}

export default VenueDetails;
