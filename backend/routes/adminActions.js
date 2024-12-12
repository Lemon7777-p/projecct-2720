// routes/adminActions.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const Event = require('../models/Event');
const User = require('../models/User');

// CRUD for Events
router.get('/events', authenticateToken, isAdmin, async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

router.post('/events', authenticateToken, isAdmin, async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

router.put('/events/:id', authenticateToken, isAdmin, async (req, res) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedEvent);
});

router.delete('/events/:id', authenticateToken, isAdmin, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted successfully.' });
});

// CRUD for Users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  const users = await User.find({}, { username: 1, role: 1 }); // Return only username and role
  res.json(users);
});

router.post('/users', authenticateToken, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required.' });
  }

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({ username, passwordHash, role });
    await newUser.save();

    res.json({ message: 'User created successfully.', user: { username, role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update fields
    user.username = username || user.username;
    user.role = role || user.role;

    // Hash the new password if provided
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully.', user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted successfully.' });
});

module.exports = router;
