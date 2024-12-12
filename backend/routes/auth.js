// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Define the secret key (hardcoded or from environment variables)
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "123";

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET_KEY, // Use the secret key here
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Use the secret key here
    const user = await User.findOne({ username: decoded.username });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
