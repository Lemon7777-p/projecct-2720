const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Venue = require('../models/Venue');
const Event = require('../models/Event');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Helper function to calculate distance (Haversine formula)
function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get all venues with filtering, event counts, and distance
router.get('/venues', authenticateToken, async (req, res) => {
  const { q, category, distance, lat, lng } = req.query;
  let query = {};

  if (q) {
    query.venuee = { $regex: q, $options: 'i' }; // Search by name
  }
  if (category) {
    query.category = category; // Filter by category
  }

  let venues = await Venue.find(query);

  // Calculate distance for each venue (if lat/lng are provided)
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxDistance = parseFloat(distance) || Infinity;

  venues = venues.map(v => {
    if (v.latitude && v.longitude && userLat && userLng) {
      v.distance = distanceBetween(userLat, userLng, parseFloat(v.latitude), parseFloat(v.longitude));
    } else {
      v.distance = 9999; // Treat venues without coordinates as far away
    }
    return v;
  });

  // Filter venues by distance
  if (distance) {
    venues = venues.filter(v => v.distance <= maxDistance);
  }

  // Aggregate event counts
  const eventCounts = await Event.aggregate([
    { $group: { _id: '$venueid', count: { $sum: 1 } } },
  ]);
  const eventCountMap = {};
  eventCounts.forEach(ec => {
    eventCountMap[ec._id] = ec.count;
  });

  // Add event count to venues
  venues = venues.map(v => ({
    ...v.toObject(),
    numEvents: eventCountMap[v.venueId] || 0,
  }));

  res.json(venues);
});

// Get details of a single venue
router.get('/venues/:id', authenticateToken, async (req, res) => {
  const { lat, lng } = req.query;

  const venue = await Venue.findOne({ venueId: req.params.id });
  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  const events = await Event.find({ venueid: req.params.id });
  const comments = await Comment.find({ venueId: req.params.id }).sort({ createdAt: -1 });

  let distance = null;
  if (lat && lng && venue.latitude && venue.longitude) {
    distance = distanceBetween(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(venue.latitude),
      parseFloat(venue.longitude)
    );
  }

  res.json({
    venue,
    events,
    distance: distance !== null ? `${distance.toFixed(2)} km` : 'N/A',
    comments,
  });
});

// Add a comment to a venue
router.post('/venues/:id/comments', authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment text is required!' });

  const venue = await Venue.findOne({ venueId: req.params.id });
  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  const newComment = new Comment({
    venueId: req.params.id,
    user: req.user.username,
    text,
  });

  await newComment.save();
  res.json(newComment);
});

// Get all events
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get user's favorite venues
router.get('/favorites', authenticateToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const favorites = await Venue.find({ venueId: { $in: user.favorites } });
  res.json(favorites);
});

// Add a venue to favorites
router.post('/favorites', authenticateToken, async (req, res) => {
  const { venueId } = req.body;
  const user = await User.findOneAndUpdate(
    { username: req.user.username },
    { $addToSet: { favorites: venueId } },
    { new: true }
  );
  res.json(user.favorites);
});

// Remove a venue from favorites
router.delete('/favorites/:venueId', authenticateToken, async (req, res) => {
  const { venueId } = req.params;
  const user = await User.findOneAndUpdate(
    { username: req.user.username },
    { $pull: { favorites: venueId } },
    { new: true }
  );
  res.json(user.favorites);
});

module.exports = router;
