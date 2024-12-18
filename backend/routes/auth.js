const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loadEvents, loadVenues } = require('../loadData'); // Import the functions to load events and venues

// Define the secret key (hardcoded or from environment variables)
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "123";

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Generate the JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET_KEY, // Use the secret key here
      { expiresIn: '1h' }
    );

    // Trigger loading events and venues after login (only if needed)
    try {
      // Load events and venues from remote XML files into the database
      await loadEvents();  // This will load events into DB
      await loadVenues();  // This will load venues into DB
      console.log('Events and venues loaded successfully.');
    } catch (err) {
      console.error('Error loading events and venues:', err);
    }

    // Send the JWT token as a response
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get the current user (protected route)
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY); // Use the secret key here
    const user = await User.findOne({ username: decoded.username });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Return user info
    res.json({ username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
