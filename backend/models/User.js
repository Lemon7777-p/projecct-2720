const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [String] // array of venueIds
});

module.exports = mongoose.model('User', UserSchema);
